function getRedisSessionId(sessionId) {
  return `ssId:${sessionId}`;
}

class RedisSessionStore {
  constructor(client) {
    this.client = client;
  }

  // get session ID in Redis
  async get(sessionId) {
    console.log("get session:", sessionId);
    const id = getRedisSessionId(sessionId);
    const data = await this.client.get(id);
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

    console.log("get session:", sessionId);
    if (typeof ttl === "number") {
      ttl = Math.ceil(ttl / 1000);
    }

    try {
      const sessionStr = JSON.stringify(session);
      if (ttl) {
        await this.client.setex(id, ttl, sessionStr);
      } else {
        await this.set(id, sessionStr);
      }
    } catch (err) {
      console.log("err:", err);
    }
  }

  // destroy session from redis
  async destroy(sessionId) {
    console.log("destroy session:", sessionId);
    const id = getRedisSessionId(sessionId);
    await this.client.del(id);
  }
}

module.exports = RedisSessionStore;
