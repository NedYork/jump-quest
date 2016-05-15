
// wrapper for "class" Player
// module.exports = (function(){
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
    this.width = 50;
    this.height = 50;
    this.jumping = false;
    this.grounded = false;
  }

  Player.prototype.update = function(step, worldWidth, worldHeight){
    // parameter step is the time between frames ( in seconds )

    // check controls and move the player accordingly
    if(Game.controls.left) { this.velX = -200 * step; }
    if(Game.controls.up && !this.jumping) {
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
// })();
module.exports = Player;
