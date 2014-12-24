class Canvas
  ->
    @domElement = document.createElement \canvas
    @dirty = true
  hitTest: (x, y) ->
    return false unless 0 <= x < @domElement.width
    return false unless 0 <= y < @domElement.height
    ctx = @domElement.getContext \2d
    image-data = ctx.getImageData do
      0, 0
      @domElement.width, @domElement.height
    x = ~~x
    y = ~~y
    i = y * image-data.width + x
    image-data.data[i * 4 + 3] isnt 0x00
  paint: ->
    @dirty = false
    @domElement.getContext \2d

module.exports = Canvas
