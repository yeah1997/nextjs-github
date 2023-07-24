const withCss = require("@zeit/next-css");
const config = require("./config");
const withBundleAnalyzer = require("@zeit/next-bundle-analyzer");
const webpack = require("webpack");

const configs = {
  distDir: "dest",
  generateEtags: true,
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  pageExtensions: ["jsx", "js"],
  generateBuildId: async () => {
    if (process.env.YOUR_BUILD_ID) {
      return process.env.YOUR_BUILD_ID;
    }
    return null;
  },
  webpack(config, options) {
    return config;
  },
  webpackDevMiddleware: (config) => {
    return config;
  },
  env: {
    customKey: "value",
  },
  serverRuntimeConfig: {
    mySecret: "secret",
    secondSecret: process.env.SECOND_SECRET,
  },
  publicRuntimeConfig: {
    staticFolder: "/static",
  },
};

if (typeof require !== undefined) {
  require.extensions[".css"] = (file) => {};
}

module.exports = withBundleAnalyzer(
  withCss({
    distDir: "dest",
    webpack(config) {
      config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
      return config;
    },
    publicRuntimeConfig: {
      GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
      OAUTH_URL: config.OAUTH_URL,
    },
    analyzerBrowser: ["browser", "both"].includes(process.env.BUNDLE_ANALYZE),
    bundleAnalyzerConfig: {
      server: {
        analyzerMode: "static",
        reportFilename: "../dest/server.html",
      },
      browser: {
        analyzerMode: "static",
        reportFilename: "../dest/client.html",
      },
    },
  })
);
