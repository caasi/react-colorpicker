React       = require 'react'
ColorPicker = React.createFactory require './ColorPicker'

{ div } = React.DOM
{ string-from-rgb, rgb-from-hsv } = require './utils'

App = React.createClass do
  displayName: 'React.App'
  getInitialState: ->
    color:
      h: 0
      s: 0
      v: 1
  render: ->
    { h, s, v } = @state.color
    color = string-from-rgb rgb-from-hsv h, s, v
    div do
      className: 'app'
      style:
        background-color: color
      ColorPicker do
        {
          onColorChange: ~> @setState color: it
        } <<< @state.color

module.exports = App
