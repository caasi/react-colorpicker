a = Math.PI / 180
sqrt3 = Math.sqrt 3
toRadian = -> it * a
toDegree = -> it / a

##
# RGB from HSV
# http://www.cs.rit.edu/~ncs/color/t_convert.html
rgb-from-hsv = (h, s, v) ->
  if s is 0
    rgb = [v, v, v]
  else
    h = (h + 360) % 360
    c = v * s
    h /= 60
    i = ~~h
    f = h - i
    p = v * (1 - s)
    q = v * (1 - s * f)
    t = v * (1 - s * (1 - f))
    # use rgb = switch i ... will create a new function
    switch i
    | 0 => rgb = [v, t, p]
    | 1 => rgb = [q, v, p]
    | 2 => rgb = [p, v, t]
    | 3 => rgb = [p, q, v]
    | 4 => rgb = [t, p, v]
    | 5 => rgb = [v, p, q]
  [~~(0xff * rgb.0), ~~(0xff * rgb.1), ~~(0xff * rgb.2)]

string-from-rgb = -> "rgb(#{it.0},#{it.1},#{it.2})"

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

module.exports = { sqrt3, toRadian, toDegree, rgb-from-hsv, string-from-rgb }
