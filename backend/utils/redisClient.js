const { createClient } = require("redis");
const config = require("config");

const redisClient = createClient({
  socket: {
    host: 'redis',
    // host: process.env.NODE_ENV === 'development' ? 'localhost' : config.get('redis.host'),
    port: config.get('redis.port')
  }
});
(async function () {
  await redisClient.connect();
})();

module.exports = redisClient;
