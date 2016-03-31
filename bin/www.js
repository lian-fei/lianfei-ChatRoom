#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('chatroom:server');
var http = require('http');


/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

var server = http.createServer(app);

//监听与客户端的链接
var io=require("socket.io")(server);
var clients={};
io.on("connection", function (socket) {
  var username;
  socket.send({"user":"系统","content":"请添加您的用户名"});

  socket.on("message", function (msg) {
    var result=msg.match(/^@(.+)\s(.+)$/);
    if(result){
      var toUser=result[1];
      var content=result[2];
      if(clients[toUser]){
        clients[toUser].send({"user":username,"content":"[私聊]"+content});
        clients[username].send({"user":username,"content":"[私聊"+toUser+"]"+content});
      }else{
        socket.send({"user":"系统","content":'你想私聊的人不存在'});
      }
    }else{
      if(username){
        for( var  client in clients ){
          clients[client].send({user:username,content:msg});
        }
      }else{
        username=msg;
        clients[username]=socket;
        socket.send({"user":"系统","content":'您的用户名已经修改为"'+username+'"'});
      }
    }
  })
});


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
