// Koa
const Koa = require("koa");
const Router = require("koa-router");
// Next JS
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.use(async (ctx, next) => {
    await handle(ctx.req, ctx.res);
    await next();
  });

  server.use(router.routes());

  server.listen(3000, () => {
    console.log("Koa server is listening on 3000");
  });
});
