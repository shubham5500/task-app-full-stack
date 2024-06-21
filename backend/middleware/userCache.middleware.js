const { isEmpty } = require("lodash");
const redisClient = require("../utils/redisClient");

async function userCacheMiddleware(req, res, next) {
    const {id} = req.params;
    const result = await redisClient.hGetAll(id);
    if (!isEmpty(result)) {
        return res.status(200).send(result);
    } else {
        next();
    }
}
module.exports = userCacheMiddleware;