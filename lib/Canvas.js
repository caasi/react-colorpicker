(function(){
  var Canvas;
  Canvas = (function(){
    Canvas.displayName = 'Canvas';
    var prototype = Canvas.prototype, constructor = Canvas;
    function Canvas(){
      this.domElement = document.createElement('canvas');
      this.dirty = true;
    }
    prototype.hitTest = function(x, y){
      var ctx, imageData, i;
      if (!(0 <= x && x < this.domElement.width)) {
        return false;
      }
      if (!(0 <= y && y < this.domElement.height)) {
        return false;
      }
      ctx = this.domElement.getContext('2d');
      imageData = ctx.getImageData(0, 0, this.domElement.width, this.domElement.height);
      x = ~~x;
      y = ~~y;
      i = y * imageData.width + x;
      return imageData.data[i * 4 + 3] !== 0x00;
    };
    prototype.paint = function(){
      this.dirty = false;
      return this.domElement.getContext('2d');
    };
    return Canvas;
  }());
  module.exports = Canvas;
}).call(this);
