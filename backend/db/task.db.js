const { ErrorHandler } = require("../error/error.helper");
const { db } = require("./connection");

const createTask = async ({
  title,
  description,
  status,
  priority,
  createdBy,
  assignedTo,
  listId,
  fileUrl,
  boardId,
}) => {
  return db.tx(async (t) => {
    const tasks = await getAllTaskByListId(listId, t);
    let position;
    if (tasks.length > 0) {
      position = tasks.length;
    } else {
      position = 0;
    }

    const taskRes = await t.one(
      `insert into tasks(
        title,
        description,
        status,
        priority,
        created_by,
        assigned_to,
        position,
        list_id
    ) values ($1, $2, $3, $4, $5, $6, $7, $8) returning *;`,
      [
        title,
        description,
        status,
        priority,
        createdBy,
        assignedTo,
        position,
        listId,
        boardId,
      ]
    );
    let taskFileRes = {};
    if (fileUrl) {
      taskFileRes = await t.one(
        `insert into task_files(task_id, file_url, uploaded_by) values($1, $2, $3) returning *`,
        [taskRes.id, fileUrl, createdBy]
      ); // update key createdBy with uploadedBy userId
    }
    return {
      ...taskRes,
      file: taskFileRes,
    };
  });
};

async function getTaskDetailById(taskId) {
  return await db.one(
    `
  SELECT 
    tasks.*, 
    json_build_object(
        'id', tfs.id,
        'url', tfs.file_url
    ) AS file, 
  COALESCE(
      json_agg(
        DISTINCT jsonb_build_object(
          'id', com.id,
          'text', com.text,
          'created_at', com.created_at,
          'user', json_build_object(
            'user_id', usr.id,
            'name', usr.name
          )
        )
      ) FILTER (WHERE com.id IS NOT NULL), 
      '[]'
    ) AS comments, 
    json_build_object(
        'id', ls.id,
        'title', ls.title
    ) AS list
  FROM 
      tasks
  INNER JOIN 
      lists ls ON tasks.list_id = ls.id
  LEFT JOIN 
      task_files tfs ON tasks.id = tfs.task_id
  LEFT JOIN
      comments com ON tasks.id = com.task_id
  LEFT JOIN 
      users usr ON usr.id = com.user_id
  WHERE 
      tasks.id = $1
  GROUP BY
      tasks.id, tfs.id, ls.id
`,
    [taskId]
  );
  /*
    This is how we contruct an nested object using json_build_object
*/
  //   return await db.one(
  //     `select tasks.*, json_build_object(
  //         'id', ls.id,
  //         'title', ls.title
  //     ) AS list from tasks inner join lists ls on tasks.list_id = ls.id where tasks.id = $1`,
  //     [taskId]
  //   );
}

async function updateTaskById(body, taskId) {
  const {
    title,
    description,
    status,
    priority,
    dueDate,
    createdBy,
    assignedTo,
  } = body;
  return db.none(
    `update tasks 
    set title=$1, description=$2, status=$3, priority=$4, due_date=$5, created_by=$6, assigned_to=$7 where id = $8;`,
    [
      title,
      description,
      status,
      priority,
      dueDate,
      createdBy,
      assignedTo,
      taskId,
    ]
  );
}

function assignTaskToUser(taskId, userId) {
  try {
    return db.one(`UPDATE tasks SET assigned_to = $1 WHERE id = $2 returning *`, [userId, taskId]);
  } catch (error) {
    throw new ErrorHandler(error)
  }
}

async function moveTask(obj) {
  /*
    {
      listId: {
        taskId: position,
        taskId: position,
        taskId: position,
        taskId: position,
      },
      listId: {
        taskId: position,
        taskId: position,
        taskId: position,
        taskId: position,
      },
    }
    Object.entries(obj).map(([key, value]) => {
      let list = obj[key],
    })
  */
  const promises = [];
  for (let list in obj) {
    const listId = list;
    for (let taskId in obj[list]) {
      const pos = obj[list][taskId];
      const sql = `update tasks set position = $1, list_id = $2 where id = $3`;
      promises.push(db.none(sql, [pos, parseInt(listId), parseInt(taskId)]));
    }
  }
  return await db.tx((t) => t.batch(promises));
}

async function getAllTaskByListId(listId, t) {
  return (
    (await t.any(`select tasks.* from tasks where list_id = $1`, [listId])) ||
    []
  );
}

async function deleteTask(taskId) {
  return await db.none("delete tasks where id = $1", [taskId]);
}

async function getAllTask(boardId) {
  return await db.one(
    `
    WITH task_comments AS (
      SELECT
          t.id AS task_id,
          COUNT(c.id) AS comment_count
      FROM tasks t
      LEFT JOIN comments c ON c.task_id = t.id
      GROUP BY t.id
  ),
  tasks_with_comments AS (
      SELECT
          t.id,
          t.title,
          t.description,
          t.status,
          t.priority,
          t.due_date,
          t.created_by,
          t.assigned_to,
          t.created_at,
          t.position,
          t.list_id,
          lists.title as list_title,
          boards.id AS board_id,
          tc.comment_count
      FROM tasks t
      JOIN lists ON t.list_id = lists.id
      JOIN boards ON lists.board_id = boards.id
      LEFT JOIN task_comments tc ON t.id = tc.task_id
      
  ),
  lists_with_tasks AS (
      SELECT
          l.id AS list_id,
          l.title AS list_title,
          COALESCE(json_agg(
              json_build_object(
                  'id', twc.id,
                  'title', twc.title,
                  'description', twc.description,
                  'status', twc.status,
                  'priority', twc.priority,
                  'due_date', twc.due_date,
                  'created_by', twc.created_by,
                  'assigned_to', twc.assigned_to,
                  'created_at', twc.created_at,
                  'position', twc.position,
                  'list_id', twc.list_id,
                  'list_title', twc.list_title,
                  'comments', twc.comment_count,
                  'board_id', twc.board_id
              )
          ) FILTER (WHERE twc.id IS NOT NULL), '[]') AS tasks
      FROM lists l
      LEFT JOIN tasks_with_comments twc ON twc.list_id = l.id
      WHERE l.board_id = $1  -- Ensure this matches the type of board_id in your database
      GROUP BY l.id, l.title
  )
  
  SELECT
      COALESCE(json_agg(lists_with_tasks), '[]') AS result
  FROM lists_with_tasks;
  
`,
    [boardId]
  );
}

async function commentOnTask(taskId, userId, commentData) {
  const { text } = commentData;
  return await db.one(
    `with 
      inserted_comment
     as (insert into 
      comments(text, task_id, user_id)
      values($1, $2, $3) 
      returning *)

    select 
      text, created_at,
      json_build_object(
        'id', usr.id,
        'name', usr.name
      ) as user
      from 
    inserted_comment ic
    inner join users usr on ic.user_id = usr.id
    `,
    [text, taskId, userId]
  );
  // return await getTaskDetailById(taskId);
}

async function getAssignedTask(userId) {
  return db.manyOrNone(`
    SELECT tasks.*, lists.id as list_id, lists.title as list_title, board_id FROM tasks
    JOIN lists ON lists.id = tasks.list_id
    WHERE assigned_to = $1
  `, [userId])
}

module.exports = {
  createTask,
  getTaskDetailById,
  moveTask,
  updateTaskById,
  deleteTask,
  getAllTask,
  commentOnTask,
  assignTaskToUser,
  getAssignedTask,
};
