<!-- Banner Image -->

<p align="center">
  <a href="https://github.com/munimtechnologies/munim-venmo">
    <h1 align="center">munim-venmo</h1>
  </a>
</p>

<p align="center">
   <a aria-label="Package version" href="https://www.npmjs.com/package/munim-venmo" target="_blank">
    <img alt="Package version" src="https://img.shields.io/npm/v/munim-venmo.svg?style=flat-square&label=Version&labelColor=000000&color=0066CC" />
  </a>
  <a aria-label="Package is free to use" href="https://github.com/munimtechnologies/munim-venmo/blob/main/LICENSE" target="_blank">
    <img alt="License: Apache-2.0" src="https://img.shields.io/badge/License-Apache%202.0-success.svg?style=flat-square&color=33CC12" target="_blank" />
  </a>
  <a aria-label="package downloads" href="https://www.npmtrends.com/munim-venmo" target="_blank">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/munim-venmo.svg?style=flat-square&labelColor=gray&color=33CC12&label=Downloads" />
  </a>
  <a aria-label="total package downloads" href="https://www.npmjs.com/package/munim-venmo" target="_blank">
    <img alt="Total Downloads" src="https://img.shields.io/npm/dt/munim-venmo.svg?style=flat-square&labelColor=gray&color=0066CC&label=Total%20Downloads" />
  </a>
</p>

<p align="center">
  <img alt="iOS" src="https://img.shields.io/badge/iOS-Venmo%20app%20%2B%20ASWebAuthenticationSession-000000?style=flat-square&logo=apple&logoColor=white" />
  <img alt="Android" src="https://img.shields.io/badge/Android-Venmo%20app%20%2B%20Custom%20Tabs-3DDC84?style=flat-square&logo=android&logoColor=white" />
  <img alt="Venmo" src="https://img.shields.io/badge/Venmo-PayPal%20Orders%20API-008CFF?style=flat-square&logo=venmo&logoColor=white" />
  <img alt="Nitro Modules" src="https://img.shields.io/badge/Nitro-Modules-FF6F00?style=flat-square" />
</p>

<p align="center">
  <a aria-label="try with expo" href="https://docs.expo.dev/"><b>Works with Expo</b></a>
&ensp;•&ensp;
  <a aria-label="documentation" href="https://github.com/munimtechnologies/munim-venmo#readme">Read the Documentation</a>
&ensp;•&ensp;
  <a aria-label="report issues" href="https://github.com/munimtechnologies/munim-venmo/issues">Report Issues</a>
</p>

<h6 align="center">Follow Munim Technologies</h6>
<p align="center">
  <a aria-label="Follow Munim Technologies on GitHub" href="https://github.com/munimtechnologies" target="_blank">
    <img alt="Munim Technologies on GitHub" src="https://img.shields.io/badge/GitHub-222222?style=for-the-badge&logo=github&logoColor=white" target="_blank" />
  </a>&nbsp;
  <a aria-label="Follow Munim Technologies on LinkedIn" href="https://linkedin.com/in/sheehanmunim" target="_blank">
    <img alt="Munim Technologies on LinkedIn" src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" target="_blank" />
  </a>&nbsp;
  <a aria-label="Visit Munim Technologies Website" href="https://munimtech.com" target="_blank">
    <img alt="Munim Technologies Website" src="https://img.shields.io/badge/Website-0066CC?style=for-the-badge&logo=globe&logoColor=white" target="_blank" />
  </a>
</p>

## Introduction

**munim-venmo** is Venmo checkout for React Native. Your app opens Venmo to approve a PayPal order. If the **Venmo app** is installed, it switches to it (like Cash App Pay or PayPal's mobile SDK). If it isn't, Venmo's site opens in an **in-app sheet** instead of throwing the customer out to the browser.

**Fully compatible with Expo!** Works with both Expo managed (development builds) and bare workflows, with a config plugin.

**Built with React Native's Nitro modules architecture** for high performance and reliability.

**Note**: Venmo is US-only and USD-only. munim-venmo opens Venmo and reads the result; creating and capturing the order happens on your server with PayPal's [Orders API](https://developer.paypal.com/docs/api/orders/v2/).

## Table of contents

- [📚 Documentation](#-documentation)
- [🚀 Features](#-features)
- [How It Works](#how-it-works)
- [Platform Support Matrix](#platform-support-matrix)
- [📦 Installation](#-installation)
- [⚡ Quick Start](#-quick-start)
- [🔧 API Reference](#-api-reference)
- [📖 Usage Examples](#-usage-examples)
- [Platform Notes](#platform-notes)
- [🔍 Troubleshooting](#-troubleshooting)
- [👏 Contributing](#-contributing)
- [📄 License](#-license)

## 📚 Documentation

<p>Learn how to take Venmo payments <a aria-label="documentation" href="https://github.com/munimtechnologies/munim-venmo#readme">in our documentation!</a></p>

- [Getting Started](#-installation)
- [API Reference](#-api-reference)
- [Usage Examples](#-usage-examples)
- [Troubleshooting](#-troubleshooting)

## 🚀 Features

### Checkout

- 📱 **Venmo app switch**: opens the Venmo app to approve the order, the same way PayPal's iOS and Android SDKs (3.2.0, `VenmoPayments`) do
- 🪟 **In-app sheet fallback**: no Venmo app? Venmo's site opens in `ASWebAuthenticationSession` (iOS) or a Custom Tab (Android), not the browser
- 🍪 **Shared sign-in**: on iOS the sheet shares Safari's cookies, so a Venmo sign-in carries over
- ✖️ **Cancel from code**: `cancelCheckout()` closes the sheet when the return arrives some other way

### Orders and returns

- 🔗 **Uses the order's own link**: pass the `payer-action` link PayPal returns, or just the order id
- 🧾 **Return URL parsing**: `parseReturnUrl` reads `approved`, `token`, `PayerID` and `canceled` the way PayPal's SDK does (case-insensitive)
- 💾 **Vaulting works too**: save Venmo for later charges with `attributes.vault` on the same order

### Additional Features

- 🔍 **App detection**: `isVenmoInstalled()` tells you whether the Venmo app is there
- 🛡️ **Safe over the air**: importing the package never throws; `isSupported()` tells JavaScript shipped to an older build whether the native code is in it
- 🎯 **TypeScript Support**: full type definitions included
- ⚡ **High Performance**: built with React Native's Nitro modules architecture
- 🚀 **Expo Compatible**: config plugin included, works with Expo managed and bare workflows
- 📦 **No PayPal SDK bundled**: the link, return parameters and client-config call are reimplemented, so there's no extra pod or Gradle dependency

## How It Works

Venmo payments through PayPal are [Orders API](https://developer.paypal.com/docs/api/orders/v2/) orders with `payment_source.venmo`. Venmo's approval link for an order (`https://account.venmo.com/go/web/paypal?token=<order>`) is a universal link / app link that the Venmo app claims. PayPal's own mobile SDKs (iOS and Android 3.2.0, `VenmoPayments`) open that link and read the result off the return URL. munim-venmo does the same, and adds one thing:

| | Venmo app installed | Venmo app not installed |
| --- | --- | --- |
| PayPal's mobile SDK | switches to the Venmo app | opens Safari / a browser |
| munim-venmo | switches to the Venmo app (`kind: 'app'`) | Venmo's site in an in-app sheet (`kind: 'returned'` or `'canceled'`) |

The sheet is `ASWebAuthenticationSession` on iOS and a Custom Tab on Android.

## Platform Support Matrix

| Function | iOS | Android | Notes |
| --- | --- | --- | --- |
| `startCheckout(options)` | ✅ | ✅ | Venmo app when installed; otherwise `ASWebAuthenticationSession` (iOS) or a Custom Tab (Android). |
| `cancelCheckout()` | ✅ | ✅ | Closes the sheet; its `startCheckout` resolves `canceled`. |
| `isVenmoInstalled()` | ✅ | ✅ | iOS needs `com.venmo.touch.v2` in `LSApplicationQueriesSchemes` (the Expo plugin adds it). Android: package visibility comes from the library's manifest. |
| `isSupported()` | ✅ | ✅ | `false` in a build without the native code. |
| `parseReturnUrl(url)` | ✅ | ✅ | Pure JS. |
| `checkoutUrlForOrder(orderId, environment?)` | ✅ | ✅ | Pure JS. |
| Web | ➖ | ➖ | Not supported. |

✅ native · ➖ not available

**Requirements**: iOS 15.1+, Android 7+ (API 24).

## 📦 Installation

### React Native CLI

```bash
npm install munim-venmo react-native-nitro-modules
# or
yarn add munim-venmo react-native-nitro-modules
```

### Expo

```bash
npx expo install munim-venmo react-native-nitro-modules
```

> **Note**: This library requires Expo SDK 50+ and works with both managed and bare workflows. To support Nitro modules, you need React Native version v0.78.0 or higher (`react-native-nitro-modules` >= 0.36.5).
>
> **Important**: This package requires a native development build in Expo. It does not work in Expo Go, and an over-the-air update can't add it. After installing, run `npx expo run:ios`, `npx expo run:android`, or create a development build with EAS.

### Expo Config Plugin

Add the plugin and rebuild:

```json
{
  "expo": {
    "plugins": ["munim-venmo"]
  }
}
```

The plugin adds `com.venmo.touch.v2` to iOS's `LSApplicationQueriesSchemes`, so `isVenmoInstalled()` can ask. `startCheckout` doesn't need it.

### iOS Setup

Without Expo, add `com.venmo.touch.v2` to `LSApplicationQueriesSchemes` in your `Info.plist` and run `pod install`:

```xml
<key>LSApplicationQueriesSchemes</key>
<array>
  <string>com.venmo.touch.v2</string>
</array>
```

### Android Setup

Nothing to add: the library's manifest declares package visibility for `com.venmo` and for Custom Tabs services, and it's merged into your app automatically.

## ⚡ Quick Start

### Open Venmo for an order

```typescript
import * as Venmo from 'munim-venmo'

const result = await Venmo.startCheckout({
  checkoutUrl: order.approveUrl, // the order's payer-action link
  callbackScheme: 'myapp',
})
if (result.kind === 'returned' && result.result.status === 'approved') {
  await captureOnYourServer(result.result.orderId)
}
```

### 1. Make the order (on your server)

Create the order with Venmo as the payment source, a return URL, and `app_switch_context`. That's what PayPal's mobile SDK sends, and it tells Venmo to return to an app. Note that Venmo's context is `{ "source": "NATIVE_APP" }`, not PayPal's `native_app` block, which returns a 500.

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

The response's `payer-action` link is the `checkoutUrl`. You can also pass `orderId` (and `environment: 'sandbox'`) and let munim-venmo build the link the way PayPal's SDK does.

Saving Venmo for later charges works the same way: add `attributes.vault` (`store_in_vault: "ON_SUCCESS"`, `usage_type: "MERCHANT"`) alongside the experience context. PayPal accepts both on one order.

PayPal's SDK also sends an `UpdateClientConfig` GraphQL call before opening Venmo. It needs no credentials, so you can send it from your server (see [Telling PayPal it's an app switch](#telling-paypal-its-an-app-switch)). Approval works without it.

### 2. Handle the return URL

Venmo sends the customer to the order's `return_url` with `approved=true&token=<order>&PayerID=<payer>`, or to `cancel_url` (`canceled=true`).

- **From the Venmo app**, make the return URL a universal link / app link to your app (`applinks:` in `apple-app-site-association`, an `autoVerify` intent filter on Android). Venmo then reopens your app, and you handle the URL like any deep link.
- **From the in-app sheet**, the sheet closes when a page navigates to `<callbackScheme>://`. Serve a page at the return URL that forwards its query there, for example `myapp://venmo/return?approved=true&token=...`. The same page also covers anyone whose device doesn't take the universal link.

```typescript
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

### 3. Capture (on your server)

Capture the order (`POST /v2/checkout/orders/{id}/capture`) once it's approved. Never trust the return URL alone; the capture is the proof.

## 🔧 API Reference

### Checkout Functions

#### `startCheckout(options): Promise<CheckoutResult>`

Opens Venmo to approve an order: the Venmo app when it's installed, otherwise Venmo's site in the in-app sheet.

| Option | Type | Description |
| --- | --- | --- |
| `checkoutUrl` | `string` | The order's `payer-action` link. Or pass `orderId`. |
| `orderId` | `string` | Builds the link like PayPal's SDK. |
| `environment` | `'live' \| 'sandbox'` | With `orderId`. Default `'live'`. |
| `callbackScheme` | `string` | Required. Your app's scheme; the sheet closes on `<scheme>://`. |
| `preferApp` | `boolean` | Switch to the Venmo app when installed. Default `true`. |
| `sharedCookies` | `boolean` | iOS: the sheet shares Safari's cookies, so a Venmo sign-in carries over. Default `true`. |

Resolves with one of:

- `{ kind: 'app' }`: the Venmo app opened. The result arrives later as your return URL.
- `{ kind: 'returned', url, result }`: the sheet came back. `result` is `parseReturnUrl(url)`.
- `{ kind: 'canceled' }`: the customer closed the sheet.

Throws when the native code is missing, when neither `checkoutUrl` nor `orderId` is given, or when `callbackScheme` isn't a URL scheme.

#### `cancelCheckout(): void`

Closes the sheet if it's open. Its `startCheckout` resolves `canceled`. Use it when the return arrives some other way, such as a universal link, while the sheet is still up.

### Detection Functions

#### `isVenmoInstalled(): boolean`

Whether the Venmo app is installed. On iOS this needs the plugin's `LSApplicationQueriesSchemes` entry; without it, it returns `false`, and `startCheckout` still opens the app by its link.

#### `isSupported(): boolean`

Whether this build has munim-venmo's native code. Importing the package never throws, so JavaScript shipped over the air to an older build can check this and fall back, for example to `Linking.openURL(checkoutUrl)`.

### URL Functions

#### `parseReturnUrl(url): VenmoReturn`

Reads Venmo's return parameters the way PayPal's SDK does (case-insensitive).

#### `checkoutUrlForOrder(orderId, environment?): string`

Venmo's approval link for an order: `https://account.venmo.com/go/web/paypal?channel=in-app&token=<order>` (sandbox: `account.ext.live.venmo.com`). Prefer the order's own `payer-action` link when you have it.

### Types

```typescript
type VenmoEnvironment = 'live' | 'sandbox'

type CheckoutOptions = {
  checkoutUrl?: string
  orderId?: string
  environment?: VenmoEnvironment
  callbackScheme: string
  preferApp?: boolean
  sharedCookies?: boolean
}

type CheckoutResult =
  | { kind: 'app' }
  | { kind: 'returned'; url: string; result: VenmoReturn }
  | { kind: 'canceled' }

type VenmoReturn =
  | { status: 'approved'; orderId: string; payerId: string }
  | { status: 'canceled'; orderId: string | null }
  | { status: 'unknown'; orderId: string | null }
```

## 📖 Usage Examples

### A Venmo button

```tsx
import { Alert, Linking, Pressable, Text } from 'react-native'
import * as Venmo from 'munim-venmo'

export function VenmoButton({ amount }: { amount: string }) {
  const pay = async () => {
    // Your server creates the order (see Quick Start) and returns its id and payer-action link.
    const order = await createVenmoOrder(amount)

    if (!Venmo.isSupported()) {
      // An older build without the native code: fall back to the browser.
      await Linking.openURL(order.approveUrl)
      return
    }

    const result = await Venmo.startCheckout({
      checkoutUrl: order.approveUrl,
      callbackScheme: 'myapp',
    })

    switch (result.kind) {
      case 'app':
        // The Venmo app opened. The return URL comes back as a deep link.
        break
      case 'returned':
        if (result.result.status === 'approved') {
          await captureOnYourServer(result.result.orderId)
        }
        break
      case 'canceled':
        Alert.alert('Venmo payment canceled')
        break
    }
  }

  return (
    <Pressable onPress={pay}>
      <Text>Pay with Venmo</Text>
    </Pressable>
  )
}
```

### The return page

A page at the order's `return_url` that hands the result to your app. The Venmo app's universal link usually skips it; it's what the in-app sheet (and any device that doesn't take the universal link) lands on.

```html
<!-- https://example.com/venmo/return -->
<script>
  location.replace('myapp://venmo/return' + location.search)
</script>
```

### Telling PayPal it's an app switch

PayPal's SDK sends this before opening Venmo. It needs no credentials and is best effort: approval works without it.

```typescript
async function markVenmoAppSwitch(orderId: string, sandbox = false) {
  const graphql = sandbox
    ? 'https://www.sandbox.paypal.com/graphql'
    : 'https://www.paypal.com/graphql'
  const query = `mutation UpdateClientConfig($token: String!, $fundingSource: ButtonFundingSourceType!, $integrationArtifact: IntegrationArtifactType!, $userExperienceFlow: UserExperienceFlowType!, $productFlow: ProductFlowType!, $channel: ProductChannel!) { updateClientConfig(token: $token, fundingSource: $fundingSource, integrationArtifact: $integrationArtifact, userExperienceFlow: $userExperienceFlow, productFlow: $productFlow, channel: $channel) }`

  await fetch(`${graphql}?UpdateClientConfig`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-app-name': 'ppcpmobilesdk',
      'Origin': graphql,
      'PayPal-Client-Context': orderId,
    },
    body: JSON.stringify({
      query,
      variables: {
        token: orderId,
        fundingSource: 'venmo',
        integrationArtifact: 'MOBILE_SDK',
        userExperienceFlow: 'INCONTEXT',
        productFlow: 'HERMES',
        channel: 'MOBILE_APP',
      },
    }),
  }).catch(() => {})
}
```

## Platform Notes

### iOS

- The sheet is an `ASWebAuthenticationSession` that watches for `<callbackScheme>://`. With `sharedCookies: true` (the default) it shares Safari's cookies, which means iOS may ask the customer to allow the sign-in first.
- `startCheckout` finds the Venmo app by its universal link, so it works even without the `LSApplicationQueriesSchemes` entry; only `isVenmoInstalled()` needs it.

### Android

- The sheet is a Custom Tab. Custom Tabs always share the browser's cookies, so `sharedCookies` has no effect.
- The library's manifest declares `<queries>` for `com.venmo` and for Custom Tabs services (Android 11+ package visibility).

### Both

- The link, return parameters and `UpdateClientConfig` call follow PayPal's Apache-2.0 [paypal-ios](https://github.com/paypal/paypal-ios) and [paypal-android](https://github.com/paypal/paypal-android) SDKs (3.2.0). munim-venmo doesn't bundle them.
- Not affiliated with PayPal or Venmo. Venmo is a trademark of PayPal, Inc.

## 🔍 Troubleshooting

### Common Issues

1. **The sheet opens even though Venmo is installed**: munim-venmo only opens the app when the OS hands it Venmo's universal link / app link (iOS opens it with `universalLinksOnly`). If the OS won't, or `preferApp` is `false`, you get the in-app sheet; that's the fallback by design.
2. **The sheet never closes after approval**: the page at your `return_url` must navigate to `<callbackScheme>://...`, and `callbackScheme` must match your app's scheme exactly.
3. **Creating the order returns a 500**: use `app_switch_context: { "source": "NATIVE_APP" }`. PayPal's `native_app` block isn't accepted for Venmo.
4. **`isVenmoInstalled()` is always `false` on iOS**: add `com.venmo.touch.v2` to `LSApplicationQueriesSchemes` (the Expo plugin does it) and rebuild.
5. **Testing in the sandbox**: PayPal's sandbox has limited Venmo support, so test the app switch against live orders. Creating an order charges nothing; only the capture does.

### Expo-Specific Issues

1. **Development Build Required**: This library requires a development build in Expo. Use `npx expo run:ios`, `npx expo run:android`, or an EAS development build. Expo Go is not supported.
2. **"native code not found"**: the app was built before munim-venmo was installed. Rebuild; an over-the-air update can't add native code. Check `isSupported()` to fall back in older builds.
3. **Nitro Modules**: Make sure you have `react-native-nitro-modules` installed

## 👏 Contributing

We welcome contributions! Open an issue or a pull request on [GitHub](https://github.com/munimtechnologies/munim-venmo).

```bash
npm install
npm run codegen   # nitrogen + TypeScript build, after changing src/specs
npm test          # Jest: return URL parsing and checkout links
scripts/compile-kotlin.sh    # Kotlin compile check against android.jar (needs kotlinc)
```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

<img alt="Star the Munim Technologies repo on GitHub to support the project" src="https://user-images.githubusercontent.com/9664363/185428788-d762fd5d-97b3-4f59-8db7-f72405be9677.gif" width="50%">
