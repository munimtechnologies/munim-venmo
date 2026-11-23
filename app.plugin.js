const { withInfoPlist } = require('@expo/config-plugins');

/**
 * munim-venmo's Expo plugin: lets isVenmoInstalled() ask iOS whether the
 * Venmo app is there (LSApplicationQueriesSchemes com.venmo.touch.v2, the
 * scheme PayPal's SDK asks too). startCheckout doesn't need it: it finds the
 * app by its universal link. Android's package visibility comes from the
 * library's own manifest.
 *
 * @param {import('@expo/config-plugins').ExpoConfig} config
 */
function withMunimVenmo(config) {
  return withInfoPlist(config, (pluginConfig) => {
    const schemes = pluginConfig.modResults.LSApplicationQueriesSchemes ?? [];
    if (!schemes.includes('com.venmo.touch.v2')) {
      schemes.push('com.venmo.touch.v2');
    }
    pluginConfig.modResults.LSApplicationQueriesSchemes = schemes;
    return pluginConfig;
  });
}

module.exports = withMunimVenmo;
module.exports.default = withMunimVenmo;
