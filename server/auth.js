const axios = require("axios");
const config = require("../config");
const { client_id, client_secret, request_token_url } = config.github;

module.exports = (server) => {
  server.use(async (ctx, next) => {
    if (ctx.path === "/auth") {
      const code = ctx.query.code;
      if (!code) {
        ctx.body = "code not exist";
        return;
      }

      const authResult = await axios({
        method: "POST",
        url: request_token_url,
        data: {
          client_id,
          client_secret,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

      if (
        authResult.status === 200 &&
        authResult.data &&
        !authResult.data.error
      ) {
        ctx.session.githubAuth = authResult.data;
        const { access_token, token_type } = authResult.data;

        const userInfoRes = await axios({
          method: "GET",
          url: "https://api.github.com/user",
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        });
        ctx.session.userInfo = userInfoRes.data;
        ctx.redirect("/");
      } else {
        const errorMsg = authResult.data && authResult.data.error;
        ctx.body = `request token failed ${errorMsg}`;
      }
    } else {
      await next();
    }
  });

  server.use(async (ctx, next) => {
    const { path, method } = ctx;
    if (path === "/logout" && method === "POST") {
      ctx.session = null;
      ctx.body = "Sign out  success";
    } else {
      await next();
    }
  });
};
