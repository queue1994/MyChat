
 var socket = io.connect();
 var userNickname = null;
 var messSound = new Audio("../sounds/message.mp3");

 socket.on('newMessage', function (data){
 	var messageSender = data.user;
 	var messDiv = null;

 	if(data.isLobbyMessage)
 		messDiv = $("#LOBBY-room .messages-box");
 	else {
 		messDiv = $("#" + messageSender + "-room .messages-box");
    	messSound.play();
 	}

 	if(messDiv.parent().attr('id') === undefined){
 		onClickUserList(messageSender);
 		messDiv = $("#" + messageSender + "-room .messages-box");
	}else
		messDiv.parent().show();	
	
 	messDiv.append('<p><b>' + messageSender + '</b>: ' + data.message + '</p>');
    messDiv.animate({scrollTop: messDiv.get(0).scrollHeight}, 0);

 });

 socket.on('nickname-feedback', function (data){

  	if(!data.nicknameCorrect){
 		$("#bad-nickname-alert").fadeIn(500);
 		return;
 	}
 	userNickname = data.nickname;
 	$("#bad-nickname-alert").fadeOut(0);
 	$("#nickname-theme h1").text("Hello " + $('#nickname-theme input').val());
	$('#nickname-theme button').fadeOut(0);
	$('#nickname-theme p').fadeOut(0);
	$('#nickname-theme input').fadeOut(0);
    $("#nickname-theme").delay(500).fadeOut(1000);
 });

 socket.on('userList', function (data){
 	editUserList(data.userList);
 });

function emitNickname(){
 	var nickname = $(nicknameInput).val();
 	var regex = /^([a-zA-Z0-9]{5,14})$/;
 	if(!regex.test(nickname)){
 		$("#bad-nickname-alert").fadeIn(500);
 		return;
 	}
 	$("#bad-nickname-alert").fadeOut(0);
 	socket.emit('nickname', {nickname : nickname});

  	$("#LOBBY-room .type-box input").focus();
 }

 function editUserList(userList){
 	var usersLi = $("#userlist");
 	$("#userlist").html('');
 	usersLi.append('<li class="sidebar-brand"><h1>Users:</h1></li>');
 	usersLi.append('<li onclick="onClickUserList($(this).text())"><a href="#"><b>LOBBY</b></a></li></li>');
 	for(var i in userList){
 		var user = userList[i];
 		usersLi.append('<li onclick="onClickUserList($(this).text())" id=user-' + user + '><a href="#">' + user + '</a></li>');
 		if(user == userNickname){
 			$("#user-" + user + " a").css('color', 'green');
 		}
 	}
 }

 function onClickUserList(nick){
 	if(nick == userNickname)return;

 	 for (i in openRooms) {
 	 	var room = openRooms[i];
 	 	if(i == nick){
 	 		$("#" + nick + "-room").show();
 	 		topMost(document.getElementById(nick + "-room"));
 	 		return;
 	 	}
 	 }
 	 var box = lobbyBox.clone(nick + "-room");
 	 $("#" + nick + "-room .messages-box").empty();
 	 box.setRoomName(nick);
 	 openRooms[nick] = box;
 	 $("#" + nick + "-room .type-box input").focus();
 	 topMost(document.getElementById(nick + "-room"));
 }

function emitNewMessage(obj){
	var nick = obj.parent().parent().attr('id');
	nick = nick.substr(0,nick.length - 5);
	
	var message = $("#" + nick + "-room .type-box input").val();
	if(message == "")return;
	socket.emit('message', {userTarget: nick, message: message});
	$("#" + nick + "-room .type-box input").val('');
	
	if(nick != "LOBBY"){
		var messDiv = obj.parent().parent().children(".messages-box");
		messDiv.append('<p><b>' + userNickname + '</b>: ' + message + '</p>');
   		messDiv.animate({scrollTop: messDiv.get(0).scrollHeight}, 0);
	}
}


 var lobbyBox = new MessageWindow("LOBBY-room");
 var openRooms = [];
 openRooms["LOBBY"] = lobbyBox;

 /*
var mess2 = mess1.clone("mess2"); 
var mess3 = mess1.clone("mess3"); 
mess2.setRoomName("queue");
mess3.setRoomName("śmieszek");
*/