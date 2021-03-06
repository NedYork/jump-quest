/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var Camera = __webpack_require__(1);
	var Map = __webpack_require__(2);
	var Player = __webpack_require__(3);
	var Rectangle = __webpack_require__(4);
	var Platform = __webpack_require__(6);
	
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	// wrapper for "class" Camera (avoid global objects)
	// module.exports = (function(){
	
	  // possibles axis to move the camera
	  var AXIS = {
	    NONE: "none",
	    HORIZONTAL: "horizontal",
	    VERTICAL: "vertical",
	    BOTH: "both"
	  };
	
	  // Camera constructor
	  function Camera(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
	  {
	    // position of camera (left-top coordinate)
	    this.xView = xView || 0;
	    this.yView = yView || 0;
	
	    // distance from followed object to border before camera starts move
	    this.xDeadZone = 0; // min distance to horizontal borders
	    this.yDeadZone = 0; // min distance to vertical borders
	
	    // viewport dimensions
	    this.wView = canvasWidth;
	    this.hView = canvasHeight;
	
	    // allow camera to move in vertical and horizontal axis
	    this.axis = AXIS.BOTH;
	
	    // object that should be followed
	    this.followed = null;
	
	    // rectangle that represents the viewport
	    this.viewportRect = new Game.Rectangle(this.xView, this.yView, this.wView, this.hView);
	
	    // rectangle that represents the world's boundary (room's boundary)
	    this.worldRect = new Game.Rectangle(0, 0, worldWidth, worldHeight);
	
	  }
	
	  // gameObject needs to have "x" and "y" properties (as world(or room) position)
	  Camera.prototype.follow = function(gameObject, xDeadZone, yDeadZone)
	  {
	    this.followed = gameObject;
	    this.xDeadZone = xDeadZone;
	    this.yDeadZone = yDeadZone;
	  }
	
	  Camera.prototype.update = function()
	  {
	    // keep following the player (or other desired object)
	    if(this.followed != null)
	    {
	      if(this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH)
	      {
	        // moves camera on horizontal axis based on followed object position
	        if(this.followed.x - this.xView  + this.xDeadZone > this.wView)
	          this.xView = this.followed.x - (this.wView - this.xDeadZone);
	        else if(this.followed.x  - this.xDeadZone < this.xView)
	          this.xView = this.followed.x  - this.xDeadZone;
	
	      }
	      if(this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH)
	      {
	        // moves camera on vertical axis based on followed object position
	        if(this.followed.y - this.yView + this.yDeadZone > this.hView)
	          this.yView = this.followed.y - (this.hView - this.yDeadZone);
	        else if(this.followed.y - this.yDeadZone < this.yView)
	          this.yView = this.followed.y - this.yDeadZone;
	      }
	
	    }
	
	    // update viewportRect
	    this.viewportRect.set(this.xView, this.yView);
	
	    // don't let camera leaves the world's boundary
	    if(!this.viewportRect.within(this.worldRect))
	    {
	      if(this.viewportRect.left < this.worldRect.left)
	        this.xView = this.worldRect.left;
	      if(this.viewportRect.top < this.worldRect.top)
	        this.yView = this.worldRect.top;
	      if(this.viewportRect.right > this.worldRect.right)
	        this.xView = this.worldRect.right - this.wView;
	      if(this.viewportRect.bottom > this.worldRect.bottom)
	        this.yView = this.worldRect.bottom - this.hView;
	    }
	
	  };
	
	module.exports = Camera;
	// })();


/***/ },
/* 2 */
/***/ function(module, exports) {

	function Map(width, height){
	  // map dimensions
	  this.width = width;
	  this.height = height;
	
	  // map texture
	  this.image = null;
	
	}
	
	// generate an example of a large map
	Map.prototype.generate = function(){
	  var ctx = document.createElement("canvas").getContext("2d");
	  ctx.canvas.width = this.width;
	  ctx.canvas.height = this.height;
	
	  // var rows = ~~(this.width/44) + 1;
	  // var columns = ~~(this.height/44) + 1;
	  //
	  // var color = "red";
	  // ctx.save();
	  // ctx.fillStyle = "red";
	  // for (var x = 0, i = 0; i < rows; x+=44, i++) {
	  //   ctx.beginPath();
	  //   for (var y = 0, j=0; j < columns; y+=44, j++) {
	  //     ctx.rect (x, y, 40, 40);
	  //   }
	  //   color = (color == "red" ? "blue" : "red");
	  //   ctx.fillStyle = color;
	  //   ctx.fill();
	  //   ctx.closePath();
	  // }
	  // ctx.restore();
	
	  // store the generate map as this image texture
	  this.image = new Image();
	  this.image.src = ctx.canvas.toDataURL("image/png");
	
	  // clear context
	  ctx = null;
	}
	
	// draw the map adjusted to camera
	Map.prototype.draw = function(context, xView, yView){
	  // easiest way: draw the entire map changing only the destination coordinate in canvas
	  // canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
	  //context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);
	
	  // didactic way:
	
	  var sx, sy, dx, dy;
	        var sWidth, sHeight, dWidth, dHeight;
	
	  // offset point to crop the image
	  sx = xView;
	  sy = yView;
	
	  // dimensions of cropped image
	  sWidth =  context.canvas.width;
	  sHeight = context.canvas.height;
	
	  // if cropped image is smaller than canvas we need to change the source dimensions
	  if(this.image.width - sx < sWidth){
	    sWidth = this.image.width - sx;
	  }
	  if(this.image.height - sy < sHeight){
	    sHeight = this.image.height - sy;
	  }
	
	  // location on canvas to draw the croped image
	  dx = 0;
	  dy = 0;
	  // match destination with source to not scale the image
	  dWidth = sWidth;
	  dHeight = sHeight;
	
	  context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
	};
	
	module.exports = Map;


/***/ },
/* 3 */
/***/ function(module, exports) {

	function Player(x, y){
	  // (x, y) = center of object
	  // ATTENTION:
	  // it represents the player position on the world(room), not the canvas position
	  this.x = x;
	  this.y = y;
	
	  // move speed in pixels per second
	  this.velX = 0;
	  this.velY = 0;
	
	  // render properties
	  this.width = 40;
	  this.height = 50;
	  this.jumping = false;
	  this.grounded = false;
	}
	
	Player.prototype.update = function(step, worldWidth, worldHeight){
	  // parameter step is the time between frames ( in seconds )
	
	  // check controls and move the player accordingly
	  if(Game.controls.left) { this.velX = -200 * step; }
	  if(Game.controls.up && this.grounded) {
	    this.jumping = true;
	    this.grounded = false;
	    this.velY = - 400 * step;
	    console.log(this.grounded);
	  }
	  if(Game.controls.right) { this.velX = 200 * step; }
	  if(Game.controls.down) { this.y += this.velY * step; }
	
	  //calculate velocities accounting for friction and gravity
	  this.velX *= Game.FRICTION;
	  this.velY += Game.GRAVITY;
	
	  if (this.grounded) {
	    this.velY = 0;
	  }
	  // update players position as a function of its velocity
	  this.x += this.velX;
	  this.y += this.velY;
	
	  // don't let player leaves the world's boundary
	  if(this.x - this.width/2 < 0){
	    this.x = this.width/2;
	  }
	  if(this.y - this.height/2 < 0){
	    this.y = this.height/2;
	  }
	  if(this.x + this.width/2 > worldWidth){
	    this.x = worldWidth - this.width/2;
	  }
	  if(this.y + this.height/2 > worldHeight){
	    this.y = worldHeight - this.height/2;
	  }
	};
	
	Player.prototype.draw = function(context, xView, yView){
	  // draw a simple rectangle shape as our player model
	  context.save();
	  context.fillStyle = "black";
	  // before draw we need to convert player world's position to canvas position
	  context.fillRect((this.x-this.width/2) - xView, (this.y-this.height/2) - yView, this.width, this.height);
	  context.restore();
	};
	
	module.exports = Player;


/***/ },
/* 4 */
/***/ function(module, exports) {

	function Rectangle(left, top, width, height){
	  this.left = left || 0;
	  this.top = top || 0;
	  this.width = width || 0;
	  this.height = height || 0;
	  this.right = this.left + this.width;
	  this.bottom = this.top + this.height;
	}
	
	Rectangle.prototype.set = function(left, top, /*optional*/width, /*optional*/height){
	  this.left = left;
	  this.top = top;
	  this.width = width || this.width;
	  this.height = height || this.height;
	  this.right = (this.left + this.width);
	  this.bottom = (this.top + this.height);
	};
	
	Rectangle.prototype.within = function(r) {
	  return (r.left <= this.left &&
	      r.right >= this.right &&
	      r.top <= this.top &&
	      r.bottom >= this.bottom);
	};
	
	Rectangle.prototype.overlaps = function(r) {
	  return (this.left < r.right &&
	      r.left < this.right &&
	      this.top < r.bottom &&
	      r.top < this.bottom);
	};
	
	module.exports = Rectangle;


/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	function Platform(x, y){
	  this.x = x;
	  this.y = y;
	  this.width = 50;
	  this.height = 50;
	}
	
	Platform.prototype.draw = function(context, xView, yView){
	  context.save();
	  context.fillStyle = "red";
	  context.fillRect((this.x-this.width/2) - xView, (this.y-this.height/2) - yView, this.width, this.height);
	  context.restore();
	};
	
	module.exports = Platform;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map