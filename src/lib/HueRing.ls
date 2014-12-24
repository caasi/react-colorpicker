Canvas = require './Canvas'

{ rgb-from-hsv } = require './utils'

class HueRing extends Canvas
  (@outer-radius, @inner-radius, @rotation = - Math.PI / 2) ->
    super!
    @debug = off
  hueFromPosition: (x, y) ->
    deg = Math.atan2(y - @outer-radius, x - @outer-radius) - @rotation
    deg *= 180 / Math.PI
    (deg + 360) % 360
  paint: ->
    @domElement
      ..width = @outer-radius * 2
      ..height = @outer-radius * 2
    center =
      x: @outer-radius
      y: @outer-radius
    ##
    # draw hue gradient
    ##
    # here is another way to draw the wheel by using arc with a little trick:
    #   http://stackoverflow.com/questions/18265804/building-a-color-wheel-in-html5
    ctx = super!
    image-data = ctx.getImageData do
      0, 0
      @domElement.width, @domElement.height
    for i from 0 til @domElement.width * @domElement.height
      x = ~~(i % @domElement.width)
      y = ~~(i / @domElement.width)
      rgb = rgb-from-hsv @hueFromPosition(x, y), 1, 1
      image-data.data[i * 4 + 0] = rgb.0
      image-data.data[i * 4 + 1] = rgb.1
      image-data.data[i * 4 + 2] = rgb.2
      image-data.data[i * 4 + 3] = 0xff
    return ctx if @debug
    ##
    # mask it to a ring
    ##
    # When stroking in Chrone,
    # globalCompositeOperation will not work properly.
    # please check:
    #   http://code.google.com/p/chromium/issues/detail?id=351178
    ctx
      ..putImageData image-data, 0, 0
      ..save!
      ..globalCompositeOperation = \destination-in
      ..fillStyle = \black
      ..beginPath!
      ..arc do
        center.x, center.y,
        @outer-radius,
        0, Math.PI * 2
      ..fill!
      ..globalCompositeOperation = \destination-out
      ..beginPath!
      ..arc do
        center.x, center.y,
        @inner-radius,
        0, Math.PI * 2
      ..fill!
      ..restore!

module.exports = HueRing
