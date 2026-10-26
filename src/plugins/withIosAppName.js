const { withInfoPlist } = require("expo/config-plugins");

const IOS_APP_DISPLAY_NAME = "Slow the F Down";

/** Sets home-screen label; keep Xcode PRODUCT_NAME as the default slug (spaces break pbxproj). */
function withIosAppName(config) {
	return withInfoPlist(config, (cfg) => {
		cfg.modResults.CFBundleDisplayName = IOS_APP_DISPLAY_NAME;
		cfg.modResults.CFBundleName = IOS_APP_DISPLAY_NAME;
		return cfg;
	});
}

module.exports = withIosAppName;
