(function(){
  var Canvas, rgbFromHsv, HueRing;
  Canvas = require('./Canvas');
  rgbFromHsv = require('./utils').rgbFromHsv;
  HueRing = (function(superclass){
    var prototype = extend$((import$(HueRing, superclass).displayName = 'HueRing', HueRing), superclass).prototype, constructor = HueRing;
    function HueRing(outerRadius, innerRadius, rotation){
      this.outerRadius = outerRadius;
      this.innerRadius = innerRadius;
      this.rotation = rotation != null
        ? rotation
        : -Math.PI / 2;
      HueRing.superclass.call(this);
      this.debug = false;
    }
    prototype.hueFromPosition = function(x, y){
      var deg;
      deg = Math.atan2(y - this.outerRadius, x - this.outerRadius) - this.rotation;
      deg *= 180 / Math.PI;
      return (deg + 360) % 360;
    };
    prototype.paint = function(){
      var x$, center, ctx, imageData, i$, to$, i, x, y, rgb, y$;
      x$ = this.domElement;
      x$.width = this.outerRadius * 2;
      x$.height = this.outerRadius * 2;
      center = {
        x: this.outerRadius,
        y: this.outerRadius
      };
      ctx = superclass.prototype.paint.call(this);
      imageData = ctx.getImageData(0, 0, this.domElement.width, this.domElement.height);
      for (i$ = 0, to$ = this.domElement.width * this.domElement.height; i$ < to$; ++i$) {
        i = i$;
        x = ~~(i % this.domElement.width);
        y = ~~(i / this.domElement.width);
        rgb = rgbFromHsv(this.hueFromPosition(x, y), 1, 1);
        imageData.data[i * 4 + 0] = rgb[0];
        imageData.data[i * 4 + 1] = rgb[1];
        imageData.data[i * 4 + 2] = rgb[2];
        imageData.data[i * 4 + 3] = 0xff;
      }
      if (this.debug) {
        return ctx;
      }
      y$ = ctx;
      y$.putImageData(imageData, 0, 0);
      y$.save();
      y$.globalCompositeOperation = 'destination-in';
      y$.fillStyle = 'black';
      y$.beginPath();
      y$.arc(center.x, center.y, this.outerRadius, 0, Math.PI * 2);
      y$.fill();
      y$.globalCompositeOperation = 'destination-out';
      y$.beginPath();
      y$.arc(center.x, center.y, this.innerRadius, 0, Math.PI * 2);
      y$.fill();
      y$.restore();
      return y$;
    };
    return HueRing;
  }(Canvas));
  module.exports = HueRing;
  function extend$(sub, sup){
    function fun(){} fun.prototype = (sub.superclass = sup).prototype;
    (sub.prototype = new fun).constructor = sub;
    if (typeof sup.extended == 'function') sup.extended(sub);
    return sub;
  }
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
