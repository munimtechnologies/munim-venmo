import type {
  MunimVenmo,
  NativeCheckoutResult,
} from './specs/munim-venmo.nitro'
import {
  checkoutUrlForOrder,
  parseReturnUrl,
  type VenmoEnvironment,
  type VenmoReturn,
} from './urls'

export {
  checkoutUrlForOrder,
  parseReturnUrl,
  type VenmoEnvironment,
  type VenmoReturn,
}

export type CheckoutOptions = {
  /**
   * Venmo's approval link for the order: the `payer-action` link PayPal's
   * Orders API returns for a `payment_source.venmo` order. Pass `orderId`
   * (and `environment`) instead to build it the way PayPal's mobile SDK does.
   */
  checkoutUrl?: string
  orderId?: string
  environment?: VenmoEnvironment
  /**
   * Your app's URL scheme (without `://`). When Venmo's site runs in the
   * in-app sheet, the sheet closes once a page navigates to `<scheme>://...`.
   * Point the order's `return_url` / `cancel_url` at a page that forwards
   * its query there (see the README).
   */
  callbackScheme: string
  /** Open the Venmo app when it's installed (default true). */
  preferApp?: boolean
  /** Let the sheet use Safari's cookies, so a Venmo sign-in carries over (iOS, default true). */
  sharedCookies?: boolean
}

export type CheckoutResult =
  /** The Venmo app opened; the customer returns through your return URL. */
  | { kind: 'app' }
  /** Venmo's site ran in the sheet and came back: approved or cancelled. */
  | { kind: 'returned'; url: string; result: VenmoReturn }
  /** The customer closed the sheet. */
  | { kind: 'canceled' }

let hybrid: MunimVenmo | null | undefined

/** The native module, or null where the app's build doesn't include it. */
function native(): MunimVenmo | null {
  if (hybrid === undefined) {
    try {
      // Required lazily, so importing this package never throws in a build
      // (or an over-the-air update) without its native code.
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { NitroModules } = require('react-native-nitro-modules')
      hybrid = NitroModules.createHybridObject('MunimVenmo') as MunimVenmo
    } catch {
      hybrid = null
    }
  }
  return hybrid
}

/** Whether this build has munim-venmo's native code. */
export function isSupported(): boolean {
  return native() !== null
}

/**
 * Whether the Venmo app is installed. On iOS this needs `com.venmo.touch.v2`
 * in LSApplicationQueriesSchemes (added by the Expo plugin); without it,
 * it says false, and `startCheckout` still opens the app by its link.
 */
export function isVenmoInstalled(): boolean {
  return native()?.isVenmoInstalled() ?? false
}

/**
 * Opens Venmo to approve an order: the Venmo app when it's installed (like
 * PayPal's mobile SDK), otherwise Venmo's site in an in-app browser sheet
 * (ASWebAuthenticationSession on iOS, a Custom Tab on Android).
 */
export async function startCheckout(
  options: CheckoutOptions
): Promise<CheckoutResult> {
  const module = native()
  if (!module) {
    throw new Error(
      'munim-venmo: native code not found. Rebuild the app after installing munim-venmo.'
    )
  }
  const checkoutUrl =
    options.checkoutUrl ??
    (options.orderId
      ? checkoutUrlForOrder(options.orderId, options.environment ?? 'live')
      : undefined)
  if (!checkoutUrl) {
    throw new Error('munim-venmo: pass checkoutUrl or orderId.')
  }
  const callbackScheme = options.callbackScheme.replace(/:\/*$/, '')
  if (!/^[a-z][a-z0-9+.-]*$/i.test(callbackScheme)) {
    throw new Error(`munim-venmo: "${options.callbackScheme}" is not a URL scheme.`)
  }
  const result: NativeCheckoutResult = await module.startCheckout({
    checkoutUrl,
    callbackScheme,
    preferApp: options.preferApp ?? true,
    sharedCookies: options.sharedCookies ?? true,
  })
  switch (result.kind) {
    case 'app':
      return { kind: 'app' }
    case 'returned':
      return {
        kind: 'returned',
        url: result.url,
        result: parseReturnUrl(result.url),
      }
    default:
      return { kind: 'canceled' }
  }
}

/** Closes the in-app sheet if it's open; its checkout resolves `canceled`. */
export function cancelCheckout(): void {
  native()?.cancelCheckout()
}

export type {
  NativeCheckoutKind,
  NativeCheckoutOptions,
  NativeCheckoutResult,
} from './specs/munim-venmo.nitro'
