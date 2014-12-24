(function(){
  var Canvas, ref$, sqrt3, rgbFromHsv, mat2d, vec2, HSVTriangle;
  Canvas = require('./Canvas');
  ref$ = require('./utils'), sqrt3 = ref$.sqrt3, rgbFromHsv = ref$.rgbFromHsv;
  ref$ = require('gl-matrix'), mat2d = ref$.mat2d, vec2 = ref$.vec2;
  HSVTriangle = (function(superclass){
    var prototype = extend$((import$(HSVTriangle, superclass).displayName = 'HSVTriangle', HSVTriangle), superclass).prototype, constructor = HSVTriangle;
    function HSVTriangle(radius, rotation){
      this.radius = radius;
      this.rotation = rotation != null
        ? rotation
        : -Math.PI / 2;
      HSVTriangle.superclass.call(this);
      this.debug = false;
      this.hue = 0;
    }
    prototype.updateRotationMatrix = function(){
      var x$;
      this.matrix = mat2d.create();
      x$ = mat2d;
      x$.translate(this.matrix, this.matrix, [this.radius, this.radius]);
      x$.rotate(this.matrix, this.matrix, -this.rotation);
      x$.translate(this.matrix, this.matrix, [-this.radius, -this.radius]);
      return x$;
    };
    prototype.updateSaturationPoint = function(){
      var r;
      r = Math.PI * 4 / 3;
      return this.pointS = vec2.fromValues(this.radius + this.radius * Math.cos(r), this.radius + this.radius * Math.sin(r));
    };
    prototype.SVFromPosition = function(x, y){
      var p, t, s, v;
      p = vec2.fromValues(x, y);
      vec2.transformMat2d(p, p, this.matrix);
      vec2.subtract(p, p, this.pointS);
      t = sqrt3 * p[1] + p[0];
      s = 2 * p[0] / t;
      v = t / 3 / this.radius;
      s = s < 0
        ? 0
        : s >= 1 ? 1 : s;
      v = v < 0
        ? 0
        : v >= 1 ? 1 : v;
      return {
        s: s,
        v: v
      };
    };
    prototype.positionFromSV = function(s, v){
      var t0, t1, p, m;
      t0 = v * this.radius;
      t1 = s / 2 * t0;
      p = vec2.fromValues(3 * t1, sqrt3 * (t0 - t1));
      vec2.add(p, p, this.pointS);
      m = mat2d.create();
      m = mat2d.invert(m, this.matrix);
      vec2.transformMat2d(p, p, m);
      return {
        x: p[0],
        y: p[1]
      };
    };
    prototype.paint = function(){
      var x$, ctx, imageData, i$, to$, i, ref$, s, v, rgb, r, step, y$, z$;
      x$ = this.domElement;
      x$.width = 2 * this.radius;
      x$.height = 2 * this.radius;
      this.updateRotationMatrix();
      this.updateSaturationPoint();
      ctx = superclass.prototype.paint.call(this);
      imageData = ctx.getImageData(0, 0, this.domElement.width, this.domElement.height);
      for (i$ = 0, to$ = this.domElement.width * this.domElement.height; i$ < to$; ++i$) {
        i = i$;
        ref$ = this.SVFromPosition(~~(i % this.domElement.width), ~~(i / this.domElement.width)), s = ref$.s, v = ref$.v;
        rgb = rgbFromHsv(this.hue, s, v);
        imageData.data[i * 4 + 0] = rgb[0];
        imageData.data[i * 4 + 1] = rgb[1];
        imageData.data[i * 4 + 2] = rgb[2];
        imageData.data[i * 4 + 3] = 0xff;
      }
      ctx.putImageData(imageData, 0, 0);
      if (this.debug) {
        return ctx;
      }
      r = this.rotation;
      step = Math.PI * 2 / 3;
      y$ = ctx;
      y$.beginPath();
      y$.moveTo(this.radius + Math.cos(r) * this.radius, this.radius + Math.sin(r) * this.radius);
      for (i$ = 0; i$ < 3; ++i$) {
        i = i$;
        ctx.lineTo(this.radius + Math.cos(r) * this.radius, this.radius + Math.sin(r) * this.radius);
        r += step;
      }
      z$ = ctx;
      z$.save();
      z$.globalCompositeOperation = 'destination-in';
      z$.fillStyle = 'black';
      z$.fill();
      z$.restore();
      return z$;
    };
    return HSVTriangle;
  }(Canvas));
  module.exports = HSVTriangle;
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
