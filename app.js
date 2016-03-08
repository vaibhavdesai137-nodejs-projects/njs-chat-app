var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

// Server is created here
app.set('port', process.env.PORT || 8081);
var server = http.createServer(app);
var io = require('socket.io')(server);
server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port') + '...');
});

app.get('/', function (req, res) {
    res.render('chat');
});

// users connected
var users = [];

io.sockets.on('connection', function (socket) {

    // new user joined
    socket.on('registerNewUser', function (data) {
        
        var username = data.username;
        users.push(username);
        
        io.sockets.emit('registeredUsers', {
            users: users
        });
    });

    // new chat msg received
    // broadcast the same msg to everyone connected
    socket.on('newChatMsgFromClient', function (data) {
        io.sockets.emit('newChatMsgFromServer', {chatMsg: data.chatMsg});
    });

})


module.exports = app;