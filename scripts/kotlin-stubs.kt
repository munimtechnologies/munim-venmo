// Compile-only stand-ins for the AndroidX / fbjni / React classes that
// munim-venmo's Kotlin (and Nitro's core Kotlin) reference. Only used by
// kotlin-check.sh; never shipped.

@file:Suppress("unused")

package androidx.annotation {
  annotation class Keep
  annotation class CallSuper
  annotation class RequiresApi(val value: Int = 1, val api: Int = 1)
}

package com.facebook.proguard.annotations {
  annotation class DoNotStrip
}

package dalvik.annotation.optimization {
  annotation class FastNative
}

package com.facebook.jni {
  class HybridData {
    fun resetNative() {}
  }
}

package com.facebook.react.bridge {
  open class ReactApplicationContext(base: android.content.Context) : android.content.ContextWrapper(base) {
    val currentActivity: android.app.Activity? get() = null
    fun addActivityEventListener(listener: ActivityEventListener?) {}
    fun removeActivityEventListener(listener: ActivityEventListener?) {}
    fun addLifecycleEventListener(listener: LifecycleEventListener?) {}
    fun removeLifecycleEventListener(listener: LifecycleEventListener?) {}
  }
  interface ActivityEventListener {
    fun onActivityResult(activity: android.app.Activity, requestCode: Int, resultCode: Int, data: android.content.Intent?)
    fun onNewIntent(intent: android.content.Intent)
  }
  open class BaseActivityEventListener : ActivityEventListener {
    override fun onActivityResult(activity: android.app.Activity, requestCode: Int, resultCode: Int, data: android.content.Intent?) {}
    override fun onNewIntent(intent: android.content.Intent) {}
  }
  interface LifecycleEventListener {
    fun onHostResume()
    fun onHostPause()
    fun onHostDestroy()
  }
  object UiThreadUtil {
    @JvmStatic fun runOnUiThread(runnable: Runnable) { runnable.run() }
  }
}

package androidx.browser.customtabs {
  class CustomTabsIntent {
    fun launchUrl(context: android.content.Context, url: android.net.Uri) {}
    class Builder {
      fun setShowTitle(showTitle: Boolean): Builder = this
      fun build(): CustomTabsIntent = CustomTabsIntent()
    }
  }
}

package com.margelo.nitro {
  class NitroModules {
    companion object {
      var applicationContext: com.facebook.react.bridge.ReactApplicationContext? = null
    }
  }
}
