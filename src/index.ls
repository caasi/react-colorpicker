React = require 'react'
App   = React.createFactory require './lib/App'
require './lib/App.css'

React.render App!, document.getElementById \container
