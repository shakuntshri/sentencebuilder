const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Disable external modules handling to avoid Windows path issues with node:sea
config.resolver.disableHierarchicalLookup = true;
config.resetCache = true;

// Override extraNodeModules to prevent Metro from trying to create node:sea directory
if (config.resolver.extraNodeModules) {
  delete config.resolver.extraNodeModules['node:sea'];
}

module.exports = config;
