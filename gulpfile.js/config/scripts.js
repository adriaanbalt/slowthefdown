var config = require('./');
var libSrcDirectory = config.coreSourceAssets + '/javascripts/include/lib';
var snippetSrcDirectory = config.coreSourceAssets + '/javascripts/include/snippets';

module.exports = {
  // src: libSrcDirectory + '/**/*.js',
  src: [libSrcDirectory + '/**/*.js',
        snippetSrcDirectory + '/**/*.js'],
  dest: config.jsAssets,
  settings: {

  }
};
