var Camera = require('./Camera.js');
var Map = require('./Map.js');
var Player = require('./Player.js');
var Rectangle = require('./Rectangle.js');
var Platform = require('./Platform.js');

window.Game = {};
Game.Camera = Camera;
Game.Platform = Platform;
Game.Map = Map;
Game.Player = Player;
Game.Rectangle = Rectangle;


// Game Script
(function(){
  // prepare game canvas
  var canvas = document.getElementById("canvas");
  var context = canvas.getContext("2d");

  // game settings:
  var FPS = 30;
  var INTERVAL = 1000/FPS; // milliseconds
  var STEP = INTERVAL/1000; // seconds

  Game.GRAVITY = 0.9;
  Game.FRICTION = 0.8;

  // setup an object that represents the room
  var room = {
    x: 0,
    y: 0,
    width: 1500,
    height: 3000,
    map: new Game.Map(1500, 3000)
  };

  // generate a large image texture for the room
  room.map.generate();

  // setup player
  var player = new Game.Player(50, room.height - 25);
  window.player = player;

  // setup the magic camera !!!
  var camera = new Game.Camera(0, 0, canvas.width, canvas.height, room.width, room.height);
  camera.follow(player, canvas.width/2, canvas.height/2);

  var platforms = [new Game.Platform(300, room.height - 20),
                   new Game.Platform(450, room.height - 100),
                   new Game.Platform(600, room.height - 190),
                   new Game.Platform(750, room.height - 280),
                   new Game.Platform(900, room.height - 370),
                   new Game.Platform(750, room.height - 460),
                   new Game.Platform(600, room.height - 550),
                   new Game.Platform(450, room.height - 640),
                   new Game.Platform(300, room.height - 730),

                 ];

  // Collision colCheck
  var colCheck = function(shapeA, shapeB) {
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
        colDir = null;

      if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {         // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
              if (vY > 0) {
                  colDir = "t";
                  shapeA.y += oY;
              } else {
                  colDir = "b";
                  shapeA.y -= oY;
              }
          } else {
              if (vX > 0) {
                  colDir = "l";
                  shapeA.x += oX;
              } else {
                  colDir = "r";
                  shapeA.x -= oX;
              }
          }
      }
      return colDir;
  };

  // Game update function
  var update = function(){
    // collision check on player
    player.grounded = false;
    platforms.forEach(function(platform) {
      var dir = colCheck(player, platform);

      if (dir === "l" || dir === "r") {
        player.velX = 0;
        // player.jumping = false;
      } else if (dir === "b") {
        player.grounded = true;
        player.jumping = false;
      } else if (dir === "t") {
        player.velY *= -1;
      }
      if (player.y === room.height - (player.height / 2)) {
        player.grounded = true;
        player.jumping = false;
      }
    });

    player.update(STEP, room.width, room.height);
    camera.update();
  };

  // Game draw function
  var draw = function(){
    // clear the entire canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // redraw all objects
    room.map.draw(context, camera.xView, camera.yView);
    player.draw(context, camera.xView, camera.yView);

    // redraw all platforms
    platforms.forEach(function(platform) {
      platform.draw(context, camera.xView, camera.yView);
    });
  };

  // Game Loop
  var gameLoop = function(){
    update();
    draw();
  };

  // <-- configure play/pause capabilities:

  // I'll use setInterval instead of requestAnimationFrame for compatibility reason,
  // but it's easy to change that.

  var runningId = -1;

  Game.play = function(){
    if(runningId == -1){
      runningId = setInterval(function(){
        gameLoop();
      }, INTERVAL);
      console.log("play");
    }
  };

  Game.togglePause = function(){
    if(runningId == -1){
      Game.play();
    }
    else
    {
      clearInterval(runningId);
      runningId = -1;
      console.log("paused");
    }
  };

  // -->

})();

// <-- configure Game controls:

Game.controls = {
  left: false,
  up: false,
  right: false,
  down: false
};

window.addEventListener("keydown", function(e){
  switch(e.keyCode)
  {
    case 37: // left arrow
      Game.controls.left = true;
      break;
    case 38: // up arrow
      Game.controls.up = true;
      break;
    case 32: //space
      Game.controls.up = true;
      break;
    case 39: // right arrow
      Game.controls.right = true;
      break;
    case 40: // down arrow
      Game.controls.down = true;
      break;
  }
}, false);

window.addEventListener("keyup", function(e){
  switch(e.keyCode)
  {
    case 37: // left arrow
      Game.controls.left = false;
      break;
    case 38: // up arrow
      Game.controls.up = false;
      break;
    case 32: // up arrow
      Game.controls.up = false;
      break;
    case 39: // right arrow
      Game.controls.right = false;
      break;
    case 40: // down arrow
      Game.controls.down = false;
      break;
    case 80: // key P pauses the game
      Game.togglePause();
      break;
  }
}, false);

// -->

// start the game when page is loaded
window.onload = function(){
  Game.play();
};
