var path = require('path');

var config = {};

config.root = path.join(__dirname, '../../');

config.publicDirectory = "./public";
config.sourceDirectory = "./app";
config.coreSourceDirectory = "./app";

config.publicAssets    = config.publicDirectory + "/assets";

config.jsAssets        = config.publicDirectory + "/assets/javascripts";
config.cssAssets        = config.publicDirectory + "/assets/stylesheets";
config.sourceAssets    = config.sourceDirectory + "/assets";

module.exports = config;
