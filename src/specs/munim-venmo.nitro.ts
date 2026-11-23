import type { HybridObject } from 'react-native-nitro-modules'

/**
 * How a checkout ended, as far as the device can tell.
 *
 * - `app`: the Venmo app opened. The customer comes back to your app
 *   through the order's return URL (a universal link / app link), which you
 *   pass to your own handler (and to `parseReturnUrl`).
 * - `returned`: Venmo's site ran in the in-app browser sheet and came back
 *   to your callback scheme; `url` is that return URL.
 * - `canceled`: the customer closed the sheet.
 */
export type NativeCheckoutKind = 'app' | 'returned' | 'canceled'

export interface NativeCheckoutResult {
  kind: NativeCheckoutKind
  /** The URL the sheet came back with (`returned` only), else empty. */
  url: string
}

export interface NativeCheckoutOptions {
  /** Venmo's approval link for the order (PayPal's `payer-action` link). */
  checkoutUrl: string
  /**
   * The scheme the in-app sheet watches for (without `://`). Venmo's site
   * comes back to the order's return URL; a page there that forwards to
   * `<scheme>://...` ends the sheet.
   */
  callbackScheme: string
  /** Switch to the Venmo app when it's installed (else the sheet). */
  preferApp: boolean
  /** Share Safari's cookies with the sheet (iOS; Android custom tabs always do). */
  sharedCookies: boolean
}

export interface MunimVenmo
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  /**
   * Whether the Venmo app is installed. iOS needs `com.venmo.touch.v2` in
   * LSApplicationQueriesSchemes (the Expo plugin adds it); without it this
   * says false and `startCheckout` still finds the app by its universal link.
   */
  isVenmoInstalled(): boolean

  /** Opens Venmo for the order: the app when it's there, else the sheet. */
  startCheckout(options: NativeCheckoutOptions): Promise<NativeCheckoutResult>

  /** Closes the sheet, if one is open (it then resolves `canceled`). */
  cancelCheckout(): void
}
