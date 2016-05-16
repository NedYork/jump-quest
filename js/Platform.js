function Platform(x, y){
  this.x = x;
  this.y = y;
  this.width = 50;
  this.height = 50;
  // this.sprite = new Sprite('../spritesheet/spritesheet.png', )
}

Platform.prototype.draw = function(context, xView, yView){
  context.save();
  context.fillStyle = "red";
  var platform = new Image();
  platform.src = './spritesheet/spritesheet.png';
  context.drawImage(platform, 340, 26, 25, 25, (this.x-this.width/2) - xView, (this.y-this.height/2) - yView, this.width, this.height);
  // context.fillRect((this.x-this.width/2) - xView, (this.y-this.height/2) - yView, this.width, this.height);
  context.restore();
};

module.exports = Platform;
