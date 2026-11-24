## [0.1.1](https://github.com/munimtechnologies/munim-venmo/compare/v0.1.0...v0.1.1) (2026-11-24)

### 📚 Documentation

* match the munim package README layout ([f81113b](https://github.com/munimtechnologies/munim-venmo/commit/f81113bdf6e4fc5b40d46eeebfd3bcaee38ef5f5))

## 0.1.0 (2026-11-23)

### ✨ Features

* Venmo checkout: `startCheckout` switches to the Venmo app for a PayPal order when it's installed, and shows Venmo's site in an in-app sheet otherwise (ASWebAuthenticationSession on iOS, a Custom Tab on Android)
* `isVenmoInstalled`, `cancelCheckout`, `isSupported`, and the `parseReturnUrl` / `checkoutUrlForOrder` helpers
* Expo config plugin (iOS `LSApplicationQueriesSchemes` for `com.venmo.touch.v2`)
