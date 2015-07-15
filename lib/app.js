var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var path = require('path');

server.listen(3000);

app.use(express.static(path.resolve(__dirname + '/../public')));

app.get('/', function(req, res){
	res.sendfile(path.resolve(__dirname + '/../public/index.html'));
});


var users = [];


io.on('connection', function (socket) {
	var socketIP = socket.handshake.address;
	var userNickname = null;
	var connectedTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	console.log(connectedTime + ": " + socketIP + " has just connected");

	socket.on('nickname', function (data){
		var nickCorrect = false;
		var nickname = data.nickname;
		if(checkIfNicknameCorrect(nickname))
			nickCorrect = true;
		socket.emit('nickname-feedback', {nicknameCorrect : nickCorrect, nickname : nickname});
		if(nickCorrect){
			console.log("HELLO " + nickname);
			users[nickname] = socket;
			userNickname = nickname;
			emitUserList();
		}
	});

	socket.on('message', function (data){
		var userTarget = data.userTarget;
		if(userTarget == "LOBBY")
			io.emit('newMessage', {user: userNickname, message: data.message, isLobbyMessage : true});
		else{
			var userTargetSocket = users[userTarget];
			userTargetSocket.emit('newMessage', {user: userNickname, message: data.message, isLobbyMessage : false});
		}
	});

  	socket.on('disconnect', function () {       //poprawić na tablice asocjacyjną
  		console.log("bye bye " + userNickname);
  		for(user in users)
  			if(user == userNickname)
  				delete users[user];
  			emitUserList();
  		});

  });


function containsKey(a, obj) {
	for(var user in users)
		if(user == obj)return true;
	return false;
}

function checkIfNicknameCorrect(nickname){
	var regex = new RegExp("^([a-zA-Z0-9]{5,14})$");
	if(!regex.test(nickname))return false;
	if(checkIfUserExistsOnServer(nickname))return false;
	return true;
}

function checkIfUserExistsOnServer (nickname){
	return containsKey(users, nickname);
}

function emitUserList(){
	io.emit('userList', {userList: Object.keys(users)});
}


function parseMessage(mess){

	for(var i=0; i<mess.length; i++){
		var character = mess.charAt(i);
		if(character == '<')
			mess = mess.replaceAt(i,'&lt');
		else if(character == '>')
			mess = mess.replaceAt(i,'&gt');
		else if(character == '&')
			mess = mess.replaceAt(i,'&amp');
	}
	return mess;
}
