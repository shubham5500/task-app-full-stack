const {
  createBoard,
  addUserToBoard,
  getAllBoards,
  getAllBoardsByUserId,
} = require("../db/board.db");

const express = require("express");
const {
  validateBoard,
  validateAddUserToBoard,
} = require("../models/board.model");
const { ErrorHandler } = require("../error/error.helper");
const { authorizedUser } = require("../middleware/auth.middleware");
const { getUsersByBoardId } = require("../db/user.db");

const boardRoute = express.Router();

boardRoute.get("/", authorizedUser, async (req, res) => {
  try {
    const { id } = req.user;
    const boards = await getAllBoardsByUserId(id);
    if (!boards.length) {
      throw new ErrorHandler(203, "No data found");
    }
    return res.status(200).send({ boards });
  } catch (error) {
    throw new ErrorHandler(500, error);
  }
});

boardRoute.post("/create", authorizedUser, async (req, res) => {
  const body = req.body;

  const validatedBoard = validateBoard(body);

  if (validatedBoard.error) {
    throw new Error(400, validatedBoard.error);
  }

  try {
    await createBoard({...body, userId: req.user.id});

    return res.status(200).send({ message: "Board created successfully!" });
  } catch (error) {
    next(error)
  }
});

boardRoute.post("/add-user", async (req, res) => {
  if (validateAddUserToBoard(req.body).error) {
    throw new ErrorHandler(403, validateAddUserToBoard(req.body).error.message);
  }
  const { userId, boardId } = req.body;
  try {
    await addUserToBoard({ userId, boardId });
    return res.status(200).send({ message: "User added!" });
  } catch (error) {
    throw new ErrorHandler(500, error);
  }
});

boardRoute.get("/:boardId/users", async (req, res, next) => {
  const { boardId } = req.params;

  try {
    const result = await getUsersByBoardId(boardId);

    if (result && !result.length) {
      throw new ErrorHandler(203, "No user found");
    }
    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  boardRoute,
};
