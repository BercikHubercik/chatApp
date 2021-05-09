const passport = require('passport');
const { Strategy } = require('passport-local');
const Database = require('sqlite-async');

module.exports = function localStrategy() {
  passport.use(new Strategy(
    async (username, password, done) => {
      try {
        const db = await Database.open('./db/db.sqlite3');
        console.log('Connected correctly to sqlite');
        const sql = 'SELECT * FROM users WHERE name = ?';
        const user = await db.get(sql, [username]);
        await db.close();
        console.log(username, password, user.name, user.password);
        if (user.name) {
          if (user.password === password) {
            console.log('login succesful');
            done(null, user);
          } else {
            done(null, false, { message: 'Incorrect password' });
          }
        } else {
          done(null, false, { message: 'Incorrect username' });
        }
      } catch (error) {
        console.error(error);
      }
    },
  ));
};
