
function  MessageWindow(id){
  this.id = id;
  this.roomName = "Lobby";
  this.elem = document.getElementById(id);

  var obj = this;

  this.draggable();
  this.setRandomPosition();

  $("#" + this.id + " .move-bar button").click(function(){
    obj.close();
  });

  $("#" + this.id).mousedown(function(){
    topMost(obj.elem);
  });

}

MessageWindow.prototype.close = function() {
  $("#" + this.id).hide();
};

MessageWindow.prototype.clone = function(newId)  {
  var clone = this.elem.cloneNode(true); 
  clone.id = newId;
  document.body.appendChild(clone);
  return new MessageWindow(newId);
};

MessageWindow.prototype.draggable = function() { 
  /*
  var handler = $("#" + this.id + "> .move-bar");
  handler.mousedown(function(){
    handler.parent().draggable("enable");
    handler.parent().draggable({
      containment: "body",
      opacity: 0.75
    });
  });
  handler.mouseup(function(){
    handler.parent().draggable("disable");
  });
*/
var handler = $("#" + this.id + "> .move-bar");
var elem = document.getElementById(this.id);
handler.mousedown(function(){
  elem.style.opacity = 0.55; 
  var pepObj = handler.parent().data('plugin_pep');
  if(pepObj)
    pepObj.toggle();

  handler.parent().pep({
    constrainTo: 'window',
    velocityMultiplier: 1,
    stop: function(){
      this.toggle();
      elem.style.opacity = 1;
    }
  });
});
};


MessageWindow.prototype.setRoomName = function(roomName) {
  this.roomName = roomName;
  $("#" + this.id + " .move-bar p").text(roomName);
};

MessageWindow.prototype.setRandomPosition = function() {
  var left = Math.random()*1000;
  var top = Math.random()*500;
  $("#" + this.id).offset({ top: top, left: left}) 
};

function topMost(htmlElement)//sloooooow
{
  var elements = document.getElementsByTagName("*");
  var highest_index = 0;

  for (var i = 0; i < elements.length - 1; i++) 
    if (parseInt(elements[i].style.zIndex) > highest_index) 
      highest_index = parseInt(elements[i].style.zIndex);

    htmlElement.style.zIndex = highest_index + 10;
  }



