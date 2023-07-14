const axios = require("axios");
const { requestGithub } = require("../lib/api");

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const { path, method, session } = ctx;

    if (path.startsWith("/github/")) {
      const githubAuth = session && session.githubAuth;
      const headers = {};

      if (githubAuth && githubAuth.access_token) {
        headers[
          "Authorization"
        ] = `${githubAuth.token_type} ${githubAuth.access_token}`;
      }

      const res = await requestGithub({
        method,
        url: `${ctx.url.replace("/github/", "/")}`,
        data: ctx.request.body || {},
        headers,
      });
      ctx.status = res.status;
      ctx.body = res.data;
    } else {
      await next();
    }
  });
};
