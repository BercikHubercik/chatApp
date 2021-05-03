const express = require('express');
const path = require('path');

const publicChatRouter = express.Router();

publicChatRouter.route('/')
  .get((req, res) => {
    res.sendFile('/chat.html', { root: path.join(__dirname, '../views') });
  });

module.exports = publicChatRouter;
