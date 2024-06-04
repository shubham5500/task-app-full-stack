const {
  createBoard,
  addUserToBoard,
  getUsersByBoardId,
  getAllBoards,
} = require("../db/board.db");

const express = require("express");
const {
  validateBoard,
  validateAddUserToBoard,
} = require("../models/board.model");
const { ErrorHandler } = require("../error/error.helper");

const boardRoute = express.Router();

boardRoute.get("/", async (req, res) => {
  try {
    const boards = await getAllBoards();
    if (!boards.length) {
      throw new ErrorHandler(203, "No data found");
    }
    return res.status(200).send({boards});
  } catch (error) {
    throw new ErrorHandler(500, error);
  }
});

boardRoute.post("/create", async (req, res) => {
  const body = req.body;
  const validatedBoard = validateBoard(body);

  if (validatedBoard.error) {
    throw new Error(400, validatedBoard.error);
  }

  await createBoard(body);

  return res.status(200).send({message: "Board created successfully!"});
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

boardRoute.get("/:boardId/users", async (req, res) => {
  const { boardId } = req.params;
  if (validateAddUserToBoard(req.body).error) {
    throw new ErrorHandler(403, validateAddUserToBoard(req.body).error.message);
  }

  try {
    const result = await getUsersByBoardId({ boardId });
    if (!result.length) {
      throw new ErrorHandler(203, "No user found");
    }
    return res.status(200).send({ result });
  } catch (error) {
    throw new ErrorHandler(500, error);
  }
});

module.exports = {
  boardRoute,
};
