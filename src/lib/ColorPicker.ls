$           = require 'jquery'
React       = require 'react'
HueRing     = require './HueRing'
HSVTriangle = require './HSVTriangle'

{ canvas }   = React.DOM
{ toRadian } = require './utils'

ColorPicker = React.createClass do
  displayName: 'ColorPicker'
  getDefaultProps: ->
    outer: 120
    inner: 90
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
    c = @refs.canvas.getDOMNode!
    dim = 2 * @props.outer
    c
      ..width  = dim
      ..height = dim
    $canvas = $ c
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
    requestAnimationFrame ~> @update @props
  componentWillReceiveProps: (nprops) ->
    requestAnimationFrame ~> @update nprops
  shouldComponentUpdate: (nprops, nstate) -> false # not very React
  update: ({ outer, inner, h, s, v }:props) ->
    ring-width = outer - inner
    { ring, triangle } = @state
    if props is @props or
       @props.h isnt h
      triangle
        ..hue = h
        ..rotation = ring.rotation + toRadian h
        ..paint!
    ring.paint! if ring.dirty
    if props is @props or
       @props.outer isnt outer or
       @props.inner isnt inner
      dim = 2 * outer
      c = @refs.canvas.getDOMNode!
      c
        ..width  = dim
        ..height = dim
      ctx = c.getContext \2d
      ctx
        ..drawImage ring.domElement, 0, 0
        ..drawImage triangle.domElement, ring-width, ring-width
  render: ->
    canvas do
      className: 'colorpicker'
      ref: 'canvas'

module.exports = ColorPicker
