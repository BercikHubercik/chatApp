const express = require('express');
const path = require('path');

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
      const { name } = req.user;
      console.log(name);
      res.render('userChat.ejs', {
        name,
      });
    });

  return chatRouter;
}

module.exports = router;
