// Koa
const Koa = require("koa");
const Router = require("koa-router");
const Session = require("koa-session");
// Next JS
const next = require("next");
// Redis
const RedisSessionStore = require("./server/session-store");
const Redis = require("ioredis");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
// create redis client
const redis = new Redis();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.keys = ["Lee Dev Github App"];
  const SESSION_CONFIG = {
    key: "lee-id",
    store: new RedisSessionStore(redis),
  };

  server.use(Session(SESSION_CONFIG, server));

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
