const { ErrorHandler } = require("../error/error.helper");
const { db } = require("./connection");

async function creatUser({ name, email, username, password }) {
  const res = await db.one(
    "insert into users(email, username, password, name) values($1, $2, $3, $4) returning *",
    [email, username, password, name]
  );
  return res;
}

async function getUserByKey(keyName, value) {
  return await db.oneOrNone(
    `select id, username, email, name, role, password from users where ${keyName}=$1;`,
    [value]
  );
}

async function getAllUsers() {
  return await db.many(`select id, username, email, name, role from users`);
}

async function getUserById(userId) {
  return await db.one("SELECT * FROM users WHERE id=$1", [userId]);
}

async function getUsersByBoardId(boardId) {
  try {
    return await db.manyOrNone(
      `
      SELECT user_id, name, email, role, board_id
        FROM board_members bm
      JOIN users u ON bm.user_id = u.id
        WHERE board_id = $1
    `,
      [boardId]
    );
  } catch (error) {
    throw new ErrorHandler(error);
  }
}

module.exports = {
  creatUser,
  getUserByKey,
  getUserById,
  getAllUsers,
  getUsersByBoardId,
};
