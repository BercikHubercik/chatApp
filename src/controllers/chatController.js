function chatController() {
  function middleware(req, res, next) {
    if (req.user) {
      next();
    } else {
      res.redirect('/');
    }
  }
  return middleware;
}

module.exports = chatController;
