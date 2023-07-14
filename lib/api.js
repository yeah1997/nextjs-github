const { default: axios } = require("axios");
const isServer = typeof window === "undefined";
const github_base_url = "https://api.github.com";

async function requestGithub({ method, url, data, headers }) {
  return await axios({
    method,
    url: `${github_base_url}${url}`,
    data,
    headers,
  });
}

async function request({ method, url, data = {} }, req, res) {
  if (!url) {
    throw Error("url must provide");
  }
  if (isServer) {
    const session = req.session;
    const githubAuth = session.githubAuth || {};
    const headers = {};

    if (githubAuth.access_token) {
      headers[
        "Authorization"
      ] = `${githubAuth.token_type} ${githubAuth.access_token}`;
    }

    return await requestGithub({ method, url, data, headers });
  } else {
    // Eg: search/....

    const res = await axios({
      method,
      url: `/github${url}`,
      data,
    });

    return res;
  }
}

module.exports = {
  request,
  requestGithub,
  github_base_url,
};
