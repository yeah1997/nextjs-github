// Koa
const Koa = require("koa");
const Router = require("koa-router");
const Session = require("koa-session");
// Next JS
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.keys = ["Lee Dev Github App"];
  const SESSION_CONFIG = {
    key: "lee-id",
    // store: {},
  };

  server.use(Session(SESSION_CONFIG, server));

  server.use(async (ctx, next) => {
    console.log("session is:", ctx.session);
    await next();
  });

  router.get("/set/user", async (ctx) => {
    ctx.session.user = {
      name: "Lee",
      age: 18,
    };
    ctx.body = "set session success";
  });

  server.use(router.routes());

  server.use(async (ctx, next) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.listen(3000, () => {
    console.log("Koa server is listening on 3000");
  });
});
