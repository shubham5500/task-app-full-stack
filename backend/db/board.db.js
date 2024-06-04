const { db } = require("./connection");

async function getAllBoards() {
  return db.many("select boards.* from boards;");
}

async function createBoard({ title, description = "" }) {
  return db.none("insert into boards(title) values($1)", [title]);
}

async function addUserToBoard({ userId, boardId }) {
  return db.none(
    "insert into board_members(user_id, board_id) values($1, $2)",
    [userId, boardId]
  );
}

async function getUsersByBoardId({ boardId }) {
  return db.many(
    `
    select 
      u.id as id,
      name,  
      username,
      email
    from
      board_members bm 
    join 
      users u on bm.user_id = u.id
    where 
      board_id = $1
    `,
    [boardId]
  );
}
module.exports = {
  createBoard,
  addUserToBoard,
  getUsersByBoardId,
  getAllBoards,
};
