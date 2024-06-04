const { db } = require("./connection");

const createList = async ({boardId, title}) => {
  return await db.one("insert into lists(title, board_id) values($1, $2) returning *", [title, boardId]);
};

module.exports = {
  createList,
};
