const express = require('express');
const path = require('path');
const Database = require('sqlite-async');

const chatRouter = express.Router();

function router() {
  chatRouter.use((req, res, next) => {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  });
  chatRouter.route('/')
    .get((req, res) => {
      (async function getUserList() {
        try {
          const db = await Database.open('./db/db.sqlite3');
          const userList = await db.all('SELECT name FROM users');
          await db.close();
          const { name } = req.user;
          res.render('userList.ejs', {
            name,
            userList,
          });
        } catch (error) {
          console.error(error);
        }
      }());
    });
  chatRouter.route('/privateRoom')
    .get((req, res) => {
      const { targetUser } = req.query;
      res.render('userChat.ejs', {
        targetUser,
      });
    });
  return chatRouter;
}

module.exports = router;
