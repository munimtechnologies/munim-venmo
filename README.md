# munim-venmo

Venmo checkout for React Native. Your app opens Venmo to approve a PayPal
order. If the **Venmo app** is installed, it switches to it (like Cash App Pay
or PayPal's mobile SDK). If it isn't, Venmo's site opens in an **in-app
sheet** instead of throwing the customer out to the browser.

Built on [Nitro Modules](https://nitro.margelo.com), with an Expo config
plugin. iOS 15.1+, Android 7+ (API 24).

```ts
import * as Venmo from 'munim-venmo'

const result = await Venmo.startCheckout({
  checkoutUrl: order.approveUrl, // the order's payer-action link
  callbackScheme: 'myapp',
})
if (result.kind === 'returned' && result.result.status === 'approved') {
  await captureOnYourServer(result.result.orderId)
}
```

## How it works

Venmo payments through PayPal are [Orders API](https://developer.paypal.com/docs/api/orders/v2/)
orders with `payment_source.venmo`. Venmo's approval link for an order
(`https://account.venmo.com/go/web/paypal?token=<order>`) is a universal
link / app link that the Venmo app claims. PayPal's own mobile SDKs (iOS and
Android 3.2.0, `VenmoPayments`) open that link and read the result off the
return URL. munim-venmo does the same, and adds one thing:

| | Venmo app installed | Venmo app not installed |
| --- | --- | --- |
| PayPal's mobile SDK | switches to the Venmo app | opens Safari / a browser |
| munim-venmo | switches to the Venmo app (`kind: 'app'`) | Venmo's site in an in-app sheet (`kind: 'returned'` or `'canceled'`) |

The sheet is `ASWebAuthenticationSession` on iOS and a Custom Tab on Android.

## Install

```sh
npm install munim-venmo react-native-nitro-modules
```

With Expo, add the plugin and rebuild (it's native code; an over-the-air
update can't add it):

```json
{ "expo": { "plugins": ["munim-venmo"] } }
```

The plugin adds `com.venmo.touch.v2` to iOS's `LSApplicationQueriesSchemes`,
so `isVenmoInstalled()` can ask. `startCheckout` doesn't need it. On Android,
the library's manifest declares package visibility for `com.venmo`.

Without Expo, add `com.venmo.touch.v2` to `LSApplicationQueriesSchemes` in
your `Info.plist` and run `pod install`.

## 1. Make the order (on your server)

Create the order with Venmo as the payment source, a return URL, and
`app_switch_context`. That's what PayPal's mobile SDK sends, and it tells
Venmo to return to an app. Note that Venmo's context is
`{ "source": "NATIVE_APP" }`, not PayPal's `native_app` block, which
returns a 500.

```http
POST /v2/checkout/orders
{
  "intent": "CAPTURE",
  "purchase_units": [{ "amount": { "currency_code": "USD", "value": "6.99" } }],
  "payment_source": {
    "venmo": {
      "experience_context": {
        "brand_name": "Your Company",
        "shipping_preference": "NO_SHIPPING",
        "return_url": "https://example.com/venmo/return",
        "cancel_url": "https://example.com/venmo/return?canceled=true",
        "app_switch_context": { "source": "NATIVE_APP" }
      }
    }
  }
}
```

The response's `payer-action` link is the `checkoutUrl`. You can also pass
`orderId` (and `environment: 'sandbox'`) and let munim-venmo build the link
the way PayPal's SDK does.

Saving Venmo for later charges works the same way: add
`attributes.vault` (`store_in_vault: "ON_SUCCESS"`, `usage_type: "MERCHANT"`)
alongside the experience context. PayPal accepts both on one order.

PayPal's SDK also sends an `UpdateClientConfig` GraphQL call before opening
Venmo. It needs no credentials, so you can send it from your server (see
`markVenmoAppSwitch` in the example below). Approval works without it.

## 2. The return URL

Venmo sends the customer to the order's `return_url` with
`approved=true&token=<order>&PayerID=<payer>`, or to `cancel_url`
(`canceled=true`).

- **From the Venmo app**, make the return URL a universal link / app link to
  your app (`applinks:` in `apple-app-site-association`, an
  `autoVerify` intent filter on Android). Venmo then reopens your app, and
  you handle the URL like any deep link.
- **From the in-app sheet**, the sheet closes when a page navigates to
  `<callbackScheme>://`. Serve a page at the return URL that forwards its
  query there, for example `myapp://venmo/return?approved=true&token=...`.
  The same page also covers anyone whose device doesn't take the universal
  link.

```ts
// Expo Router: app/+native-intent.tsx
import { parseReturnUrl } from 'munim-venmo'

export function redirectSystemPath({ path }: { path: string }) {
  if (path.includes('/venmo/return')) {
    const result = parseReturnUrl(path)
    if (result.status === 'approved') captureOnYourServer(result.orderId)
    return '' // stay where you are
  }
  return path
}
```

Capture the order on your server (`POST /v2/checkout/orders/{id}/capture`)
once it's approved. Never trust the return URL alone; the capture is the
proof.

## API

### `startCheckout(options): Promise<CheckoutResult>`

| Option | | |
| --- | --- | --- |
| `checkoutUrl` | `string` | The order's `payer-action` link. Or pass `orderId`. |
| `orderId` | `string` | Builds the link like PayPal's SDK. |
| `environment` | `'live' \| 'sandbox'` | With `orderId`. Default `'live'`. |
| `callbackScheme` | `string` | Your app's scheme; the sheet closes on `<scheme>://`. |
| `preferApp` | `boolean` | Switch to the Venmo app when installed. Default `true`. |
| `sharedCookies` | `boolean` | iOS: the sheet shares Safari's cookies, so a Venmo sign-in carries over. Default `true`. |

Resolves with one of:

- `{ kind: 'app' }`: the Venmo app opened. The result arrives later as your
  return URL.
- `{ kind: 'returned', url, result }`: the sheet came back. `result` is
  `parseReturnUrl(url)`.
- `{ kind: 'canceled' }`: the customer closed the sheet.

### `cancelCheckout(): void`

Closes the sheet if it's open. Its `startCheckout` resolves `canceled`. Use
it when the return arrives some other way, such as a universal link, while
the sheet is still up.

### `isVenmoInstalled(): boolean`

Whether the Venmo app is installed. On iOS this needs the plugin's
`LSApplicationQueriesSchemes` entry.

### `isSupported(): boolean`

Whether this build has munim-venmo's native code. Importing the package
never throws, so JavaScript shipped over the air to an older build can check
this and fall back, for example to `Linking.openURL(checkoutUrl)`.

### `parseReturnUrl(url): VenmoReturn`

Reads Venmo's return parameters the way PayPal's SDK does (case-insensitive):

- `{ status: 'approved', orderId, payerId }`
- `{ status: 'canceled', orderId | null }`
- `{ status: 'unknown', orderId | null }`

### `checkoutUrlForOrder(orderId, environment?)`

Venmo's approval link for an order:
`https://account.venmo.com/go/web/paypal?channel=in-app&token=<order>`
(sandbox: `account.ext.live.venmo.com`).

## Notes

- Venmo is US-only and USD-only. PayPal's sandbox has limited Venmo support,
  so test the Venmo app switch against live orders. Creating an order
  charges nothing; only the capture does.
- The link, return parameters and `UpdateClientConfig` call follow PayPal's
  Apache-2.0 [paypal-ios](https://github.com/paypal/paypal-ios) and
  [paypal-android](https://github.com/paypal/paypal-android) SDKs (3.2.0).
  munim-venmo doesn't bundle them.
- Not affiliated with PayPal or Venmo. Venmo is a trademark of PayPal, Inc.

## License

Apache-2.0
