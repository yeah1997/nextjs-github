// Koa
const Koa = require("koa");
const Router = require("koa-router");
const Session = require("koa-session");
// Next JS
const next = require("next");
// Redis
const RedisSessionStore = require("./server/session-store");
const Redis = require("ioredis");
// auth, session
const auth = require("./server/auth");

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

  auth(server);

  router.get("/api/user/info", async (ctx) => {
    const user = ctx.session.userInfo;
    if (!user) {
      ctx.status = 401;
      ctx.body = "Need Login";
      return;
    }
    ctx.body = user;
    ctx.set("Content-Type", "application/json");
  });

  server.use(router.routes());

  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session;
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
