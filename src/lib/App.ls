React       = require 'react'
ColorPicker = React.createFactory require './ColorPicker'

{ div } = React.DOM

App = React.createClass do
  displayName: 'React.App'
  render: ->
    div do
      className: 'app'
      ColorPicker!

module.exports = App
