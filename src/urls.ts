export type VenmoEnvironment = 'live' | 'sandbox'

/** What Venmo's return URL says about the order. */
export type VenmoReturn =
  | { status: 'approved'; orderId: string; payerId: string }
  | { status: 'canceled'; orderId: string | null }
  | { status: 'unknown'; orderId: string | null }

const VENMO_HOSTS: Record<VenmoEnvironment, string> = {
  live: 'https://account.venmo.com',
  // PayPal's sandbox switches to Venmo's ext.live host.
  sandbox: 'https://account.ext.live.venmo.com',
}

/**
 * Venmo's approval link for a PayPal order, as PayPal's mobile SDK builds it
 * (`/go/web/paypal?channel=in-app&token=<order>`). Prefer the order's own
 * `payer-action` link when you have it.
 */
export function checkoutUrlForOrder(
  orderId: string,
  environment: VenmoEnvironment = 'live'
): string {
  return `${VENMO_HOSTS[environment]}/go/web/paypal?channel=in-app&token=${encodeURIComponent(orderId)}`
}

function queryOf(url: string): URLSearchParams {
  const query = url.split('#')[0]?.split('?')[1] ?? ''
  return new URLSearchParams(query)
}

/**
 * Reads Venmo's return: `approved=true&token=<order>&PayerID=<payer>` once
 * the customer approves, `canceled=true` when they back out (the parameters
 * PayPal's mobile SDK reads). Case-insensitive names, like the SDK.
 */
export function parseReturnUrl(url: string): VenmoReturn {
  const params = queryOf(url)
  const get = (name: string): string | null => {
    for (const [key, value] of params) {
      if (key.toLowerCase() === name.toLowerCase()) return value
    }
    return null
  }
  const orderId = get('token') || null
  if (get('canceled')?.toLowerCase() === 'true') {
    return { status: 'canceled', orderId }
  }
  const payerId = get('PayerID')
  if (get('approved')?.toLowerCase() === 'true' && orderId && payerId) {
    return { status: 'approved', orderId, payerId }
  }
  return { status: 'unknown', orderId }
}
