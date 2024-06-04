const jwt = require('jsonwebtoken');
const config = require('config');
const path = require('path');
const { authorizedUser } = require('../middleware/auth.middleware');
const { getAllUsers } = require('../db/user.db');
const { ErrorHandler } = require('../error/error.helper');

const userRoute = require("express").Router();

userRoute.get('/profile', authorizedUser, async (req, res) => {
  return res.send('Hello')
})

// all users
userRoute.get('/all', authorizedUser, async (req, res) => {
  try {
    const users = await getAllUsers();

    if (!users.length) {
      throw new ErrorHandler(204, 'No users found');
    }
    res.cookie('some-cookie', 'SHubham', {
      maxAge: 40000000
    })
    return res.status(200).send(users);
  } catch (error) {
    
  }
  return res.send('Hello')
})

// users by board
userRoute.get('/all/:boardId', authorizedUser, async (req, res) => {
  return res.send('Hello')
})



module.exports = userRoute;
