const { db } = require("./connection");

async function getAllBoards() {
  return db.many("select boards.* from boards;");
}

async function getAllBoardsByUserId(userId) {
  return db.manyOrNone(
    `
    SELECT * FROM boards 
    JOIN board_members bm ON bm.board_id = boards.id 
    WHERE bm.user_id = $1;
  `,
    [userId]
  );
}

async function createBoard({ title, description = "", userId }) {
  return db.tx(async (t) => {
    const board = await t.one(
      "insert into boards(title) values($1) returning id",
      [title]
    );
    await t.none(
      `insert into board_members(user_id, board_id) values($1, $2)`,
      [userId, board.id]
    );
  });
}

async function addUserToBoard({ userId, boardId }) {
  return db.none(
    "insert into board_members(user_id, board_id) values($1, $2)",
    [userId, boardId]
  );
}

module.exports = {
  createBoard,
  addUserToBoard,
  getAllBoards,
  getAllBoardsByUserId,
};
