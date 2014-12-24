(function(){
  var React, HueRing, HSVTriangle, canvas, toRadian, ColorPicker;
  React = require('react');
  HueRing = require('./HueRing');
  HSVTriangle = require('./HSVTriangle');
  canvas = React.DOM.canvas;
  toRadian = require('./utils').toRadian;
  ColorPicker = React.createClass({
    displayName: 'ColorPicker',
    getDefaultProps: function(){
      return {
        outer: 200,
        inner: 160,
        h: 0,
        s: 0,
        v: 1
      };
    },
    getInitialState: function(){
      return {
        ring: null,
        triangle: null
      };
    },
    componentDidMount: function(){
      var x$;
      x$ = this.state;
      x$.ring = new HueRing(this.props.outer, this.props.inner);
      x$.triangle = new HSVTriangle(this.props.inner);
      return this.update();
    },
    update: function(){
      var ringWidth, ref$, ring, triangle, h, s, v, x$, ctx, y$;
      ringWidth = this.props.outer - this.props.inner;
      ref$ = this.state, ring = ref$.ring, triangle = ref$.triangle;
      ref$ = this.props, h = ref$.h, s = ref$.s, v = ref$.v;
      console.log(ring.rotation);
      x$ = triangle;
      x$.hue = h;
      x$.rotation = ring.rotation + toRadian(h);
      if (ring.dirty) {
        ring.paint();
      }
      if (triangle.dirty) {
        triangle.paint();
      }
      ctx = this.refs.canvas.getDOMNode().getContext('2d');
      y$ = ctx;
      y$.drawImage(ring.domElement, 0, 0);
      y$.drawImage(triangle.domElement, ringWidth, ringWidth);
      return y$;
    },
    render: function(){
      var dim;
      dim = 2 * this.props.outer;
      return canvas({
        className: 'colorpicker',
        ref: 'canvas',
        width: dim,
        height: dim
      });
    }
  });
  module.exports = ColorPicker;
}).call(this);
