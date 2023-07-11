const withCss = require("@zeit/next-css");
const config = require("./config");

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

const GITHUB_OAUTH_URL = "https://github.com/login/oauth/authorize";
const SCOPE = "user";

module.exports = withCss({
  distDir: "dest",
  publicRuntimeConfig: {
    GITHUB_OAUTH_URL: config.GITHUB_OAUTH_URL,
    OAUTH_URL: config.OAUTH_URL,
  },
});
