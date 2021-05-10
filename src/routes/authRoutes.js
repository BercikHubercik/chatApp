const express = require('express');
const Database = require('sqlite-async');
const passport = require('passport');
const url = require('url');

const authRouter = express.Router();

authRouter.route('/signUp')
  .post((req, res) => {
    const { username, password } = req.body;
    const params = [username, password];
    (async function addUser() {
      try {
        const db = await Database.open('./db/db.sqlite3');
        console.log('Connected correctly to sqlite');
        const nameExists = await db.get('SELECT EXISTS(SELECT * FROM users WHERE name = ?)', [username]);
        console.log(nameExists);
        if (nameExists['EXISTS(SELECT * FROM users WHERE name = ?)'] === 0) {
          const sql = `INSERT INTO users (name, password) 
                  VALUES (?, ?)`;
          await db.run(sql, params);
          console.log('User added');
          const user = await db.get('SELECT * FROM users WHERE name = ?', [username]);
          await db.close();
          req.login(user, () => {
            res.redirect('/chat');
            console.log('redi');
          });
        } else {
          res.redirect(url.format({
            pathname: "/",
            query: {
              'msg': 'Username taken, use different one',
            },
          }));
        }
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
