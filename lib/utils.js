(function(){
  var a, sqrt3, toRadian, toDegree, rgbFromHsv, stringFromRgb;
  a = Math.PI / 180;
  sqrt3 = Math.sqrt(3);
  toRadian = function(it){
    return it * a;
  };
  toDegree = function(it){
    return it / a;
  };
  rgbFromHsv = function(h, s, v){
    var rgb, c, i, f, p, q, t;
    if (s === 0) {
      rgb = [v, v, v];
    } else {
      h = (h + 360) % 360;
      c = v * s;
      h /= 60;
      i = ~~h;
      f = h - i;
      p = v * (1 - s);
      q = v * (1 - s * f);
      t = v * (1 - s * (1 - f));
      switch (i) {
      case 0:
        rgb = [v, t, p];
        break;
      case 1:
        rgb = [q, v, p];
        break;
      case 2:
        rgb = [p, v, t];
        break;
      case 3:
        rgb = [p, q, v];
        break;
      case 4:
        rgb = [t, p, v];
        break;
      case 5:
        rgb = [v, p, q];
      }
    }
    return [~~(0xff * rgb[0]), ~~(0xff * rgb[1]), ~~(0xff * rgb[2])];
  };
  stringFromRgb = function(it){
    return "rgb(" + it[0] + "," + it[1] + "," + it[2] + ")";
  };
  /*
  class ImageLoader
    (@paths) ->
      @images = {}
      @loaded = 0
    load: !(on-load) ->
      for path in @paths
        img = new Image
          ..src = path
          ..onload = ~>
            if ++@loaded is @paths.length
              on-load?!
        @images[path] = img
    get: (path) ->
      @images[path]
  
  image-manager = new ImageLoader [data.image, data.mask]
  */
  module.exports = {
    sqrt3: sqrt3,
    toRadian: toRadian,
    toDegree: toDegree,
    rgbFromHsv: rgbFromHsv,
    stringFromRgb: stringFromRgb
  };
}).call(this);
