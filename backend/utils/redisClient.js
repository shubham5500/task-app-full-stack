const { createClient } = require("redis");

const redisClient = createClient();
(async function () {
  await redisClient.connect();
})();

module.exports = redisClient;
