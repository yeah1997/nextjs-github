const Redis = require("ioredis");

const redis = new Redis({
  port: 6379,
});

async function keysLog() {
  const keys = await redis.keys("*");
  // console.log(keys);
}

keysLog();
