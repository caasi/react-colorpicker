(function(){
  var React, ColorPicker, div, App;
  React = require('react');
  ColorPicker = React.createFactory(require('./ColorPicker'));
  div = React.DOM.div;
  App = React.createClass({
    displayName: 'React.App',
    render: function(){
      return div({
        className: 'app'
      }, ColorPicker({
        onColorChange: function(it){
          return console.log(it);
        }
      }));
    }
  });
  module.exports = App;
}).call(this);
