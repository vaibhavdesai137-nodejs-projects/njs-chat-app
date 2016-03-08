var socket = io();

$(function () {

    // register new user
    $('#enterChatBtn').click(function () {
        registerNewUser();
    });

    // server acknowledged with all connected users
    // hide the login form
    // show the chat window
    socket.on('registeredUsers', function (data) {
        populateUsersTable(data.users);
        $('#enterChatDiv').hide();
        $('#mainDiv').show();
    });

    // send new chat msg to server
    $('#sendMsgBtn').click(function () {
        sendNewChatMsg();
    });

    // show new chat msg from server
    socket.on('newChatMsgFromServer', function (data) {
        showNewChatMsg(data.chatMsg);
    });

});

// new user joining
function registerNewUser() {

    var username = $('#username').val();
    username = username.trim();

    if (username !== '') {
        socket.emit('registerNewUser', {
            username: username
        });
    }
}

// show all connected users in table
function populateUsersTable(users) {

    $('#userCount').html('[' + users.length + ']');
    for (var user in users) {
        var row = '<tr><td>' + users[user] + '</td></tr>';
        $('#usersTable').append(row);
    }
}

// send new chat msg to server
function sendNewChatMsg() {

    var newChatMsg = $('#textInput').val();
    newChatMsg = newChatMsg.trim();

    if (newChatMsg !== '') {
        socket.emit('newChatMsgFromClient', {
            chatMsg: newChatMsg
        });
    }

    // clear the text box
    $('#textInput').val('');
}

// show new chat msg from server
function showNewChatMsg(msg) {
    $('#chatWindowDiv').append(msg + '<br>');
}