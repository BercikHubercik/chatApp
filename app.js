const express = require('express');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '/src/views')));

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
