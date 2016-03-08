var socket = io();
var registered = false;
var username;

$(function () {

    // register new user
    $('#enterChatBtn').click(function () {
        registerNewUser();
    });

    // server acknowledged with all connected users
    // hide the login form
    // show the chat window
    socket.on('registeredUsers', function (data) {

        // show the chat window if we just registered 
        // or if we were already registered
        if (data.username === username || registered) {
            registered = true;
            clearErrorMsgs();
            populateUsersList(data.users);
            $('#enterChatDiv').hide();
            $('#mainDiv').show();
        }
    });

    // failed to register, username exists
    socket.on('registrationFailed', function (data) {
        $('#errorMsg').html(data.msg);
        $('#errorDiv').show();
    });

    // show new chat msg from server
    socket.on('newChatMsgFromServer', function (data) {
        if (registered) {
            showNewChatMsg(data.sender, data.chatMsg);
        }
    });

});

// clear error msgs on successful registration
function clearErrorMsgs() {
    $('#errorMsg').html('');
    $('#errorDiv').hide();
}

// new user joining
function registerNewUser() {

    username = $('#username').val().trim();

    if (username !== '') {
        socket.emit('registerNewUser', {
            username: username
        });
    }
}

// show all connected users in table
function populateUsersList(users) {

    $('#usersList').empty();
    $('#userCount').html('<b>[' + users.length + ']</b>');
    for (var user in users) {
        var row = '<li>' + users[user] + '</li>';
        $('#usersList').append(row);
    }
}

// send new chat msg to server
function sendNewChatMsg(e) {

    // enter was hit
    if (e.keyCode === 13) {

        var newChatMsg = $('#chatMsgTextBox').val();
        newChatMsg = newChatMsg.trim();

        if (newChatMsg !== '') {
            socket.emit('newChatMsgFromClient', {
                chatMsg: newChatMsg
            });
        }

        // clear the text box
        $('#chatMsgTextBox').val('');
    }

}

// show new chat msg from server
function showNewChatMsg(sender, msg) {
    $('#chatMsgs').append('<li><b>' + sender + '</b>: ' + msg + '</li>');
}