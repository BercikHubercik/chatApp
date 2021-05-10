const express = require('express');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const passportSocketIo = require('passport.socketio');

const sessionStorage = new SQLiteStore();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const chatRouter = require('./src/routes/chatRoutes')();
const authRouter = require('./src/routes/authRoutes');
const publicChatRouter = require('./src/routes/publicChatRoutes');

app.use(cookieParser());
const sessionMiddleware = session({ secret: 'changeit', resave: false, saveUninitialized: false });
app.use(sessionMiddleware);
require('./src/config/passport.js')(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/auth', authRouter);
app.use('/chat', chatRouter);
app.use('/publicChat', publicChatRouter);
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/src/views')));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let msg;
  if (req.query.msg) {
    msg = req.query.msg;
  } else {
    msg = '';
  }
  res.render('index.ejs', {
    errorMsg: msg,
  });
});

// function onAuthorizeSucces(data, accept) {
//   console.log('successfull connection to socket.io');
//   accept(null, true);
// }
// function onAuthorizeFail(data, accept) {
//   console.log('unsuccesfull auth');
//   accept(new Error('authorization rejected'));
// }
const wrap = (middleware) => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));
io.use((socket, next) => {
  if (socket.request.user) {
    next();
  } else {
    next(new Error("unauthorized"));
  }
});

io.on('connection', (socket) => {
  console.log(`new connection ${socket.id}`);
  const username = socket.request.user.name;
  io.emit('user connected', username);
  socket.on('chat message', (msg) => {
    const userMsg = `${username} : ${msg}`;
    io.emit('chat message', userMsg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
