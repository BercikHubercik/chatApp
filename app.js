const express = require('express');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const chatRouter = require('./src/routes/chatRoutes')();
const authRouter = require('./src/routes/authRoutes');
const publicChatRouter = require('./src/routes/publicChatRoutes');

app.use(cookieParser());
app.use(session({ secret: 'chat' }));
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
  res.sendFile(path.join(__dirname, '/src/views/index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('Listening on port 3000');
});
