package com.munimvenmo

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Handler
import android.os.Looper
import androidx.browser.customtabs.CustomTabsIntent
import com.facebook.react.bridge.BaseActivityEventListener
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.UiThreadUtil
import com.margelo.nitro.NitroModules
import com.margelo.nitro.core.Promise
import com.margelo.nitro.munimvenmo.HybridMunimVenmoSpec
import com.margelo.nitro.munimvenmo.NativeCheckoutKind
import com.margelo.nitro.munimvenmo.NativeCheckoutOptions
import com.margelo.nitro.munimvenmo.NativeCheckoutResult

/**
 * Opens Venmo to approve a PayPal order. The order's Venmo link is an app
 * link the Venmo app claims (PayPal's Android SDK, VenmoPayments 3.2.0,
 * opens the same link), so it goes to the app when it's installed; otherwise
 * Venmo's site runs in a Custom Tab, which ends when a page navigates to the
 * app's callback scheme (the app's own deep link brings the URL back here).
 */
class HybridMunimVenmo : HybridMunimVenmoSpec() {
  companion object {
    private const val VENMO_PACKAGE = "com.venmo"
    /** A resume with no return this long after it means the tab was closed. */
    private const val CLOSED_TAB_GRACE_MS = 700L
  }

  private val mainHandler = Handler(Looper.getMainLooper())
  private var pending: PendingTab? = null

  private class PendingTab(
    val promise: Promise<NativeCheckoutResult>,
    val scheme: String,
    val context: ReactApplicationContext,
  ) {
    var opened = false
    var activityListener: BaseActivityEventListener? = null
    var lifecycleListener: LifecycleEventListener? = null
    var closedCheck: Runnable? = null
  }

  override fun isVenmoInstalled(): Boolean {
    val context = NitroModules.applicationContext ?: return false
    return try {
      if (Build.VERSION.SDK_INT >= 33) {
        context.packageManager.getPackageInfo(VENMO_PACKAGE, PackageManager.PackageInfoFlags.of(0))
      } else {
        @Suppress("DEPRECATION")
        context.packageManager.getPackageInfo(VENMO_PACKAGE, 0)
      }
      true
    } catch (_: PackageManager.NameNotFoundException) {
      false
    }
  }

  override fun startCheckout(options: NativeCheckoutOptions): Promise<NativeCheckoutResult> {
    val uri = Uri.parse(options.checkoutUrl)
    if (uri.scheme?.lowercase() != "https") {
      return Promise.rejected(IllegalArgumentException("munim-venmo: checkoutUrl must be an https link."))
    }
    val context = NitroModules.applicationContext
      ?: return Promise.rejected(IllegalStateException("munim-venmo: React context unavailable"))
    val activity = context.currentActivity
      ?: return Promise.rejected(IllegalStateException("munim-venmo: needs a foreground Activity"))

    val promise = Promise<NativeCheckoutResult>()
    UiThreadUtil.runOnUiThread {
      if (options.preferApp && openInVenmoApp(activity, uri)) {
        promise.resolve(NativeCheckoutResult(NativeCheckoutKind.APP, ""))
        return@runOnUiThread
      }
      openTab(activity, context, uri, options.callbackScheme, promise)
    }
    return promise
  }

  override fun cancelCheckout() {
    UiThreadUtil.runOnUiThread { finish(NativeCheckoutResult(NativeCheckoutKind.CANCELED, "")) }
  }

  /** The link in the Venmo app only (never a browser); false when it isn't there. */
  private fun openInVenmoApp(activity: Activity, uri: Uri): Boolean {
    val intent = Intent(Intent.ACTION_VIEW, uri).addCategory(Intent.CATEGORY_BROWSABLE)
    if (Build.VERSION.SDK_INT >= 30) {
      intent.addFlags(Intent.FLAG_ACTIVITY_REQUIRE_NON_BROWSER)
    } else {
      if (!isVenmoInstalled()) return false
      intent.setPackage(VENMO_PACKAGE)
    }
    return try {
      activity.startActivity(intent)
      true
    } catch (_: ActivityNotFoundException) {
      false
    } catch (_: SecurityException) {
      false
    }
  }

  private fun openTab(
    activity: Activity,
    context: ReactApplicationContext,
    uri: Uri,
    scheme: String,
    promise: Promise<NativeCheckoutResult>,
  ) {
    // One checkout at a time: the newer one replaces the older.
    finish(NativeCheckoutResult(NativeCheckoutKind.CANCELED, ""))
    val tab = PendingTab(promise, scheme.lowercase(), context)
    tab.activityListener = object : BaseActivityEventListener() {
      override fun onNewIntent(intent: Intent) {
        val data = intent.data ?: return
        if (data.scheme?.lowercase() == tab.scheme) {
          finish(NativeCheckoutResult(NativeCheckoutKind.RETURNED, data.toString()))
        }
      }
    }
    tab.lifecycleListener = object : LifecycleEventListener {
      override fun onHostResume() {
        if (!tab.opened) return
        // Back in the app: a return arrives as a new intent right around
        // now; with none, the customer closed the tab.
        tab.closedCheck?.let { mainHandler.removeCallbacks(it) }
        val check = Runnable { finish(NativeCheckoutResult(NativeCheckoutKind.CANCELED, ""), only = tab) }
        tab.closedCheck = check
        mainHandler.postDelayed(check, CLOSED_TAB_GRACE_MS)
      }
      override fun onHostPause() {}
      override fun onHostDestroy() {}
    }
    context.addActivityEventListener(tab.activityListener)
    context.addLifecycleEventListener(tab.lifecycleListener)
    pending = tab
    try {
      CustomTabsIntent.Builder().setShowTitle(true).build().launchUrl(activity, uri)
      tab.opened = true
    } catch (error: ActivityNotFoundException) {
      // No Custom Tabs browser: any browser, which still comes back by the scheme.
      try {
        activity.startActivity(Intent(Intent.ACTION_VIEW, uri))
        tab.opened = true
      } catch (fallbackError: ActivityNotFoundException) {
        cleanUp(tab)
        pending = null
        promise.reject(fallbackError)
      }
    }
  }

  private fun finish(result: NativeCheckoutResult, only: PendingTab? = null) {
    val tab = pending ?: return
    if (only != null && only !== tab) return
    pending = null
    cleanUp(tab)
    tab.promise.resolve(result)
  }

  private fun cleanUp(tab: PendingTab) {
    tab.closedCheck?.let { mainHandler.removeCallbacks(it) }
    tab.activityListener?.let { tab.context.removeActivityEventListener(it) }
    tab.lifecycleListener?.let { tab.context.removeLifecycleEventListener(it) }
  }
}
