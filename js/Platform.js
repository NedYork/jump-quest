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
