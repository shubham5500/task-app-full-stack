const config = require("config");

const { authorizedUser } = require("../middleware/auth.middleware");
const {
  getAllUsers,
  getUserById,
  getUsersByBoardId,
} = require("../db/user.db");
const { ErrorHandler } = require("../error/error.helper");
const userCacheMiddleware = require("../middleware/userCache.middleware");
const redisClient = require("../utils/redisClient");
const { omit } = require("lodash");
const userRoute = require("express").Router();

// all users
userRoute.get("/", authorizedUser, async (req, res) => {
  try {
    const users = await getAllUsers();

    if (!users.length) {
      throw new ErrorHandler(204, "No users found");
    }
    res.cookie("some-cookie", "SHubham", {
      maxAge: 40000000,
    });
    return res.status(200).send(users);
  } catch (error) {}
  return res.send("Hello");
});

// userRoute.post("/board", async (req, res) => {
//   const { boardId } = req.body;
//   console.log({ boardId });
//   try {
//     const results = await getUsersByBoardId(boardId);
//     if (!results.length) {
//       return res.status(204).send({ message: "No content found." });
//     }
//     return res.status(200).send(results);
//   } catch (error) {
//     next(error);
//   }
// });


userRoute.get(
  "/:id",
  [authorizedUser, userCacheMiddleware],
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const result = await getUserById(id);

      const userData = omit(result, "password");
      await redisClient.hSet(id, userData);
      await redisClient.expire(id, 3600);

      return res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  }
);

userRoute.get("/profile", authorizedUser, async (req, res) => {
  return res.status(200).send(req.user);
});

// users by board
userRoute.get("/all/:boardId", authorizedUser, async (req, res) => {
  return res.send("Hello");
});

module.exports = userRoute;
