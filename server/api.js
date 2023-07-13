const axios = require("axios");
const github_base_url = "https://api.github.com";

module.exports = (server) => {
  server.use(async (ctx, next) => {
    const path = ctx.path;
    if (path.startsWith("/github/")) {
      const githubAuth = ctx.session.githubAuth;
      const githubPath = `${github_base_url}${ctx.url.replace(
        "/github/",
        "/"
      )}`;
      const token = githubAuth && githubAuth.access_token;
      const headers = {};

      if (token) {
        headers["Authorization"] = `${githubAuth.token_type} ${token}`;
      }

      try {
        const res = await axios({
          method: "GET",
          url: githubPath,
          headers,
        });

        if (res.status === 200) {
          ctx.body = res.data;
          ctx.set("Content-Type", "application/json");
        } else {
          ctx.status = res.status;
          ctx.body = {
            success: false,
          };
          ctx.set("Content-Type", "application/json");
        }
      } catch (err) {
        console.log(err, "error");
        ctx.body = {
          success: false,
        };
        ctx.set("Content-Type", "application/json");
      }
    } else {
      await next();
    }
  });
};
