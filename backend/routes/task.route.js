const express = require("express");
const config = require("config");
const { isEmpty } = require("lodash");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

const { validateTask, validateTaskFile } = require("../models/task.model");
const { ErrorHandler } = require("../error/error.helper");
const multer = require("multer");
const path = require("path");

const {
  createTask,
  getTaskDetailById,
  updateTaskById,
  deleteTask,
  getAllTask,
  moveTask,
  commentOnTask,
  assignTaskToUser,
  getAssignedTask,
} = require("../db/task.db");
const { validateComment } = require("../models/comment.model");
const userRoute = require("./user.route");
const { authorizedUser } = require("../middleware/auth.middleware");

const taskRoute = express.Router();
const s3 = new AWS.S3({
  // accessKeyId: config.get("credentials.aws_access_key_id"),
  // secretAccessKey: config.get("credentials.secret_access_key"),
});
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "new-free-bucket",
    metadata: function (req, file, cb) {
      // console.log({ req });
      cb(null, file.filename);
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

// Add routes
taskRoute.post("/", authorizedUser, async (req, res) => {
  const { boardId } = req.body;
  const tasks = await getAllTask(boardId);
  return res.status(200).send(tasks);
});

taskRoute.post(
  "/create",
  authorizedUser,
  upload.single("taskFiles"),
  async (req, res) => {
    const file = req.file || {};
    const body = req.body;
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      listId,
    } = body;

    // description: "";
    // listId: 25;
    // priority: "medium";
    // status: "pending";
    // title: "hello";

    const validatedTask = validateTask({
      title,
      description,
      status,
      priority,
      assignedTo,
      listId,
    });

    if (!isEmpty(file)) {
      const validtedTaskFile = validateTaskFile({
        fileUrl: file.location,
        uploadedBy: 1 || req.user.id,
      });

      if (validtedTaskFile.error) {
        throw new ErrorHandler(400, validatedTask.error);
      }
    }

    if (validatedTask.error) {
      throw new ErrorHandler(400, validatedTask.error);
    }

    const result = await createTask({
      title,
      description,
      status,
      priority,
      assignedTo: assignedTo || req.user.id,
      fileUrl: file.location,
      createdBy: req.user.id,
      listId,
    });

    return res.status(200).send(result);
  }
);

taskRoute.get("/assigned-task", authorizedUser, async (req, res, next) => {
  const { id } = req.user;
  try {
    const result = await getAssignedTask(id);
    if (!result) {
      return res.status(203).send({ message: "No content found." });
    }
    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

taskRoute
  .get("/:taskId", authorizedUser, async (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    const taskDetail = await getTaskDetailById(taskId);
    res.status(200).send(taskDetail);
  })
  .patch("/:taskId", authorizedUser, async (req, res) => {
    // assigned_to_id
    const taskId = parseInt(req.params.taskId);
    const {
      title,
      description,
      status,
      priority,
      assignedTo,
      position,
    } = req.body;

    // const validatedTask = validateTask({
    //   title,
    //   description,
    //   status,
    //   priority,
    //   assignedTo,
    //   position,
    // });

    // if (validatedTask.error) {
    //   throw new ErrorHandler(400, validatedTask.error);
    // }

    await updateTaskById(req.body, taskId);
    return res.status(200).send(req.body);
  })
  .delete("/:taskId", authorizedUser, async (req, res) => {
    const taskId = req.params.taskId;

    await deleteTask(taskId);
    return res.status(200).send("Deleted successfully!");
  });

taskRoute.post("/:taskId/assign", authorizedUser, async (req, res, next) => {
  const { assignToId } = req.body;
  const { taskId } = req.params;

  if (!assignToId) {
    throw new ErrorHandler(400, "User id not found.");
  }

  try {
    const result = await assignTaskToUser(taskId, assignToId);
    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

taskRoute.post("/:taskId/comment", authorizedUser, async (req, res) => {
  const body = req.body;
  const { taskId } = req.params;
  const { id: userId } = req.user; // todo: remove the OR sign
  const { text } = body;
  const validateCommentObj = validateComment({ text });

  if (validateCommentObj.error) {
    throw new ErrorHandler(403, validateCommentObj.error);
  }

  const result = await commentOnTask(taskId, userId, { text });
  return res.status(200).send({ message: "Create Successfully!", result });
});

taskRoute.put("/:boardId/move", async (req, res) => {
  const { boardId } = req.params;
  const body = req.body;
  await moveTask(body);
  const tasks = await getAllTask(boardId);
  return res.status(200).send(tasks);
});

module.exports = {
  taskRoute,
};
