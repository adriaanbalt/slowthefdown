var config = require('./')

module.exports = {
  watch: config.sourceDirectory + '/assets/localization/**/*',
  src: [config.sourceDirectory + '/assets/localization/**/*'],
  dest: config.publicDirectory + '/assets/localization/'
}
