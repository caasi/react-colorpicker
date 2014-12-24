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
  getInitialState: ->
    ring: null
    triangle: null
  componentDidMount: ->
    @state
      ..ring     = new HueRing @props.outer, @props.inner
      ..triangle = new HSVTriangle @props.inner
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
