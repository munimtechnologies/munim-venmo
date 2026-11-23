//
//  HybridMunimVenmo.swift
//  munim-venmo
//
//  Opens Venmo to approve a PayPal order. Like PayPal's iOS SDK
//  (VenmoPayments 3.2.0, VenmoClient), the order's Venmo link is a universal
//  link the Venmo app claims, so opening it switches to the app. Unlike the
//  SDK, which then opens Safari when the app isn't installed, Venmo's site
//  runs in an ASWebAuthenticationSession sheet over the app and ends when a
//  page navigates to the app's callback scheme.
//

import AuthenticationServices
import Foundation
import NitroModules
import UIKit

final class HybridMunimVenmo: HybridMunimVenmoSpec {
    /// The scheme the Venmo app answers to (PayPal's SDK asks it the same way).
    private static let venmoAppScheme = "com.venmo.touch.v2://"

    private var session: ASWebAuthenticationSession?
    private var sessionPromise: Promise<NativeCheckoutResult>?
    private let presenter = SheetPresenter()

    func isVenmoInstalled() throws -> Bool {
        guard let url = URL(string: Self.venmoAppScheme) else { return false }
        return onMain { UIApplication.shared.canOpenURL(url) }
    }

    func startCheckout(options: NativeCheckoutOptions) throws -> Promise<NativeCheckoutResult> {
        guard let url = URL(string: options.checkoutUrl), url.scheme?.lowercased() == "https" else {
            throw RuntimeError.error(withMessage: "munim-venmo: checkoutUrl must be an https link.")
        }
        let promise = Promise<NativeCheckoutResult>()
        DispatchQueue.main.async {
            guard options.preferApp else {
                self.openSheet(url, options: options, promise: promise)
                return
            }
            // Universal links only: true when the Venmo app took the link,
            // false when it isn't installed (no Safari detour).
            UIApplication.shared.open(url, options: [.universalLinksOnly: true]) { opened in
                if opened {
                    promise.resolve(withResult: NativeCheckoutResult(kind: .app, url: ""))
                } else {
                    self.openSheet(url, options: options, promise: promise)
                }
            }
        }
        return promise
    }

    func cancelCheckout() throws {
        DispatchQueue.main.async {
            guard let session = self.session else { return }
            session.cancel()
            self.finishSheet(with: NativeCheckoutResult(kind: .canceled, url: ""))
        }
    }

    // MARK: - Sheet

    /// Venmo's site in an in-app browser sheet, ended by `<callbackScheme>://`.
    private func openSheet(_ url: URL, options: NativeCheckoutOptions, promise: Promise<NativeCheckoutResult>) {
        if session != nil {
            // One checkout at a time: the newer one replaces the older.
            session?.cancel()
            finishSheet(with: NativeCheckoutResult(kind: .canceled, url: ""))
        }
        let session = ASWebAuthenticationSession(
            url: url,
            callbackURLScheme: options.callbackScheme
        ) { [weak self] callbackURL, error in
            DispatchQueue.main.async {
                guard let self else { return }
                if let callbackURL {
                    self.finishSheet(with: NativeCheckoutResult(kind: .returned, url: callbackURL.absoluteString))
                } else if let error = error as? ASWebAuthenticationSessionError, error.code == .canceledLogin {
                    self.finishSheet(with: NativeCheckoutResult(kind: .canceled, url: ""))
                } else {
                    self.failSheet(error ?? RuntimeError.error(withMessage: "munim-venmo: the sheet closed without a result."))
                }
            }
        }
        session.presentationContextProvider = presenter
        // Shared cookies keep a Venmo sign-in from Safari (and for next time).
        session.prefersEphemeralWebBrowserSession = !options.sharedCookies
        self.session = session
        self.sessionPromise = promise
        if !session.start() {
            self.session = nil
            self.sessionPromise = nil
            promise.reject(withError: RuntimeError.error(withMessage: "munim-venmo: couldn't open the sheet."))
        }
    }

    private func finishSheet(with result: NativeCheckoutResult) {
        let promise = sessionPromise
        session = nil
        sessionPromise = nil
        promise?.resolve(withResult: result)
    }

    private func failSheet(_ error: Error) {
        let promise = sessionPromise
        session = nil
        sessionPromise = nil
        promise?.reject(withError: error)
    }

    private func onMain<T>(_ body: () -> T) -> T {
        if Thread.isMainThread { return body() }
        return DispatchQueue.main.sync(execute: body)
    }
}

/// Presents the sheet over the app's key window.
private final class SheetPresenter: NSObject, ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        let scenes = UIApplication.shared.connectedScenes.compactMap { $0 as? UIWindowScene }
        let active = scenes.first { $0.activationState == .foregroundActive } ?? scenes.first
        if let window = active?.windows.first(where: \.isKeyWindow) ?? active?.windows.first {
            return window
        }
        return ASPresentationAnchor()
    }
}
