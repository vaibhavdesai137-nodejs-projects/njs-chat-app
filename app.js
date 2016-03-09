var express = require('express');
var path = require('path');
var http = require('http');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

// Server is created here
app.set('port', process.env.PORT || 8080);
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

    console.log('New user connected...');

    // new user joined
    socket.on('registerNewUser', function (data) {

        var username = data.username;

        if (users.indexOf(username) === -1) {
            users.push(username);
            socket.username = username;

            io.sockets.emit('registeredNewUser', {
                username: username
            });

            emitConnectedUsersList();

        } else {
            io.sockets.emit('registrationFailed', {
                username: username,
                msg: "Username '" + username + "' already registered"
            });
        }

    });

    // new chat msg received
    // broadcast the same msg to everyone connected
    // also say who the sender was
    // also send the list of all users
    socket.on('newChatMsgFromClient', function (data) {
        io.sockets.emit('newChatMsgFromServer', {
            chatMsg: data.chatMsg,
            sender: socket.username,
            users: users
        });
    });

    // new user joined
    socket.on('disconnect', function (data) {

        console.log('User disconnected, username: ' + socket.username);
        var index = users.indexOf(socket.username);
        if (index !== -1) {
            users.splice(index, 1);
            emitConnectedUsersList();
        }

    });

    // send list of current users
    function emitConnectedUsersList() {
        io.sockets.emit('registeredUsers', {
            users: users
        });
    }

})


module.exports = app;