const express = require('express');
const Database = require('sqlite-async');
const passport = require('passport');

const authRouter = express.Router();

authRouter.route('/signUp')
  .post((req, res) => {
    const { username, password } = req.body;
    const params = [username, password];
    (async function addUser() {
      try {
        const db = await Database.open('./db/db.sqlite3');
        console.log('Connected correctly to sqlite');
        const sql = `INSERT INTO users (name, password) 
                  VALUES (?, ?)`;
        await db.run(sql, params);
        console.log('User added');
        const user = await db.get('SELECT * FROM users WHERE name = ?', [username]);
        req.login(user, () => {
          res.redirect('/chat');
          console.log('redi');
        });
      } catch (error) {
        console.error(error);
      }
    }());
  });
authRouter.route('/signIn')
  .post(passport.authenticate('local', {
    successRedirect: '/chat',
    failureRedirect: '/',
  }));

module.exports = authRouter;
