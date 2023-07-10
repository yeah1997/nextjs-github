function getRedisSessionId(sessionId) {
  return `ssId:${sessionId}`;
}

class RedisSessionStore {
  constructor(RedisClient) {
    this.RedisClient = RedisClient;
  }

  // get session ID in Redis
  async get(sessionId) {
    const id = getRedisSessionId(sessionId);
    const data = await this.RedisClient.get(id);
    if (!data) {
      return null;
    }

    try {
      const result = JSON.parse(data);
      return result;
    } catch (err) {
      console.log("err:", err);
    }
  }

  // set session to redis
  async set(sessionId, session, ttl) {
    const id = getRedisSessionId(sessionId);

    if (typeof ttl === "number") {
      ttl = Math.ceil(ttl / 1000);
    }

    try {
      const sessionStr = JSON.stringify(session);
      if (ttl) {
        await this.RedisClient.setex(id, ttl, sessionStr);
      } else {
        await this.set(id, sessionStr);
      }
    } catch (err) {
      console.log("err:", err);
    }
  }

  // destroy session from redis
  async destroy(sessionId) {
    const id = getRedisSessionId(sessionId);
    await this.RedisClient.del(id);
  }
}

module.exports = RedisSessionStore;
