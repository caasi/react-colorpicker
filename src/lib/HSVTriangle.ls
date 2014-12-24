Canvas = require './Canvas'

{ sqrt3, rgb-from-hsv } = require './utils'
{ mat2d, vec2 }  = require 'gl-matrix'

class HSVTriangle extends Canvas
  (@radius, @rotation = - Math.PI / 2) ->
    super!
    @debug = off
    @hue = 0
  updateRotationMatrix: ->
    @matrix = mat2d.create!
    mat2d
      ..translate @matrix, @matrix, [@radius, @radius]
      ..rotate    @matrix, @matrix, -@rotation
      ..translate @matrix, @matrix, [-@radius, -@radius]
  updateSaturationPoint: ->
    r = Math.PI * 4 / 3
    @point-s = vec2.fromValues @radius + @radius * Math.cos(r), @radius + @radius * Math.sin(r)
  # what a mess
  SVFromPosition: (x, y) ->
    # rotate
    p = vec2.fromValues x, y
    vec2.transformMat2d p, p, @matrix
    vec2.subtract p, p, @point-s
    # end of rotate
    t = sqrt3 * p.1 + p.0
    s = 2 * p.0 / t
    v = t / 3 / @radius
    s = if s < 0 then 0 else if s >= 1 then 1 else s
    v = if v < 0 then 0 else if v >= 1 then 1 else v
    {s: s, v: v}
  positionFromSV: (s, v) ->
    t0 = v * @radius
    t1 = s / 2 * t0
    p = vec2.fromValues 3 * t1, sqrt3 * (t0 - t1)
    #rotate
    vec2.add p, p, @point-s
    m = mat2d.create!
    m = mat2d.invert m, @matrix
    vec2.transformMat2d p, p, m
    {x: p.0, y: p.1}
  paint: ->
    @domElement
      ..width = 2 * @radius
      ..height = 2 * @radius
    @updateRotationMatrix!
    @updateSaturationPoint!
    ctx = super!
    image-data = ctx.getImageData do
      0, 0
      @domElement.width, @domElement.height
    for i from 0 til @domElement.width * @domElement.height
      {s, v} = @SVFromPosition ~~(i % @domElement.width), ~~(i / @domElement.width)
      #continue unless 0 <= s < 1 and 0 <= v < 1
      rgb = rgb-from-hsv @hue, s, v
      image-data.data[i * 4 + 0] = rgb.0
      image-data.data[i * 4 + 1] = rgb.1
      image-data.data[i * 4 + 2] = rgb.2
      image-data.data[i * 4 + 3] = 0xff
    ctx.putImageData image-data, 0, 0
    return ctx if @debug
    # mask
    r = @rotation
    step = Math.PI * 2 / 3
    ctx
      ..beginPath!
      ..moveTo @radius + Math.cos(r) * @radius, @radius + Math.sin(r) * @radius
    for i from 0 til 3
      ctx.lineTo @radius + Math.cos(r) * @radius, @radius + Math.sin(r) * @radius
      r += step
    ctx
      ..save!
      ..globalCompositeOperation = \destination-in
      ..fillStyle = \black
      ..fill!
      ..restore!

module.exports = HSVTriangle
