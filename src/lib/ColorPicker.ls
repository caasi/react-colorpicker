$           = require 'jquery'
React       = require 'react'
HueRing     = require './HueRing'
HSVTriangle = require './HSVTriangle'

{ canvas }   = React.DOM
{ toRadian } = require './utils'

ColorPicker = React.createClass do
  displayName: 'ColorPicker'
  getDefaultProps: ->
    outer: 200
    inner: 160
    h: 0
    s: 0
    v: 1
    onColorChange: ->
  getInitialState: ->
    rid: 0
    ring: null
    triangle: null
  componentDidMount: ->
    ring-width = @props.outer - @props.inner
    @state
      ..ring     = new HueRing @props.outer, @props.inner
      ..triangle = new HSVTriangle @props.inner
    $top = $ try document
    $canvas = $ @refs.canvas.getDOMNode!
    handlers =
      ring:
        mousedown: (e) ~>
          { left: x, top: y } = $canvas.offset!
          x = e.pageX - x
          y = e.pageY - y
          if @state.ring.hitTest x, y
            handlers.ring.mousemove e
            $top
              ..mousemove handlers.ring.mousemove
              ..mouseup   handlers.ring.mouseup
        mousemove: (e) ~>
          { left: x, top: y } = $canvas.offset!
          x = e.pageX - x
          y = e.pageY - y
          hue = @state.ring.hueFromPosition x, y
          @props.onColorChange h: hue, s: @props.s, v: @props.v
        mouseup: ~>
          $top
            ..off \mousemove handlers.ring.mousemove
            ..off \mouseup   handlers.ring.mouseup
      triangle:
        mousedown: (e) ~>
          { left: x, top: y } = $canvas.offset!
          x = e.pageX - x - ring-width
          y = e.pageY - y - ring-width
          if @state.triangle.hitTest x, y
            handlers.triangle.mousemove e
            $top
              ..mousemove handlers.triangle.mousemove
              ..mouseup   handlers.triangle.mouseup
        mousemove: (e) ~>
          { left: x, top: y } = $canvas.offset!
          x = e.pageX - x - ring-width
          y = e.pageY - y - ring-width
          { s, v } = @state.triangle.SVFromPosition x, y
          @props.onColorChange h: @props.h, s: s, v: v
        mouseup: ~>
          $top
            ..off \mousemove handlers.triangle.mousemove
            ..off \mouseup   handlers.triangle.mouseup
    $canvas
      ..mousedown handlers.ring.mousedown
      ..mousedown handlers.triangle.mousedown
    @update!
  update: ->
    ring-width = @props.outer - @props.inner
    { ring, triangle } = @state
    { h, s, v } = @props
    console.log ring.rotation
    triangle
      ..hue = h
      ..rotation = ring.rotation + toRadian h
    ring.paint!     if ring.dirty
    triangle.paint! if triangle.dirty
    ctx = @refs.canvas.getDOMNode!getContext \2d
    ctx
      ..drawImage ring.domElement, 0, 0
      ..drawImage triangle.domElement, ring-width, ring-width
  render: ->
    dim = 2 * @props.outer
    canvas do
      className: 'colorpicker'
      ref: 'canvas'
      width:  dim
      height: dim

module.exports = ColorPicker
