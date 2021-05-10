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
          console.log('Connected correctly to sqlite');
          const userList = await db.all('SELECT name FROM users');
          console.log(userList);
          await db.close();
          const { name } = req.user;
          res.render('userChat.ejs', {
            name,
            userList,
          });
        } catch (error) {
          console.error(error);
        }
      }());
    });
  return chatRouter;
}

module.exports = router;
