## 0.1.0 (2026-11-23)

### ✨ Features

* Venmo checkout: `startCheckout` switches to the Venmo app for a PayPal order when it's installed, and shows Venmo's site in an in-app sheet otherwise (ASWebAuthenticationSession on iOS, a Custom Tab on Android)
* `isVenmoInstalled`, `cancelCheckout`, `isSupported`, and the `parseReturnUrl` / `checkoutUrlForOrder` helpers
* Expo config plugin (iOS `LSApplicationQueriesSchemes` for `com.venmo.touch.v2`)
