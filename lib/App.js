(function(){
  var React, ColorPicker, div, ref$, stringFromRgb, rgbFromHsv, App;
  React = require('react');
  ColorPicker = React.createFactory(require('./ColorPicker'));
  div = React.DOM.div;
  ref$ = require('./utils'), stringFromRgb = ref$.stringFromRgb, rgbFromHsv = ref$.rgbFromHsv;
  App = React.createClass({
    displayName: 'React.App',
    getInitialState: function(){
      return {
        color: {
          h: 0,
          s: 0,
          v: 1
        }
      };
    },
    render: function(){
      var ref$, h, s, v, color, this$ = this;
      ref$ = this.state.color, h = ref$.h, s = ref$.s, v = ref$.v;
      color = stringFromRgb(rgbFromHsv(h, s, v));
      return div({
        className: 'app',
        style: {
          backgroundColor: color
        }
      }, ColorPicker(import$({
        onColorChange: function(it){
          return this$.setState({
            color: it
          });
        }
      }, this.state.color)));
    }
  });
  module.exports = App;
  function import$(obj, src){
    var own = {}.hasOwnProperty;
    for (var key in src) if (own.call(src, key)) obj[key] = src[key];
    return obj;
  }
}).call(this);
