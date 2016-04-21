var config = require('./')

module.exports = {
  src: [config.sourceAssets + "/images/**", config.coreSourceAssets + "/images/**"],
  dest: config.publicAssets + "/images"
};
