(function(){
  var $, React, HueRing, HSVTriangle, canvas, toRadian, ColorPicker;
  $ = require('jquery');
  React = require('react');
  HueRing = require('./HueRing');
  HSVTriangle = require('./HSVTriangle');
  canvas = React.DOM.canvas;
  toRadian = require('./utils').toRadian;
  ColorPicker = React.createClass({
    displayName: 'ColorPicker',
    getDefaultProps: function(){
      return {
        outer: 120,
        inner: 90,
        h: 0,
        s: 0,
        v: 1,
        onColorChange: function(){}
      };
    },
    getInitialState: function(){
      return {
        rid: 0,
        ring: null,
        triangle: null
      };
    },
    componentDidMount: function(){
      var ringWidth, x$, $top, c, dim, y$, $canvas, handlers, z$, this$ = this;
      ringWidth = this.props.outer - this.props.inner;
      x$ = this.state;
      x$.ring = new HueRing(this.props.outer, this.props.inner);
      x$.triangle = new HSVTriangle(this.props.inner);
      $top = $((function(){
        try {
          return document;
        } catch (e$) {}
      }()));
      c = this.refs.canvas.getDOMNode();
      dim = 2 * this.props.outer;
      y$ = c;
      y$.width = dim;
      y$.height = dim;
      $canvas = $(c);
      handlers = {
        ring: {
          mousedown: function(e){
            var ref$, x, y, x$;
            ref$ = $canvas.offset(), x = ref$.left, y = ref$.top;
            x = e.pageX - x;
            y = e.pageY - y;
            if (this$.state.ring.hitTest(x, y)) {
              handlers.ring.mousemove(e);
              x$ = $top;
              x$.mousemove(handlers.ring.mousemove);
              x$.mouseup(handlers.ring.mouseup);
              return x$;
            }
          },
          mousemove: function(e){
            var ref$, x, y, hue;
            ref$ = $canvas.offset(), x = ref$.left, y = ref$.top;
            x = e.pageX - x;
            y = e.pageY - y;
            hue = this$.state.ring.hueFromPosition(x, y);
            return this$.props.onColorChange({
              h: hue,
              s: this$.props.s,
              v: this$.props.v
            });
          },
          mouseup: function(){
            var x$;
            x$ = $top;
            x$.off('mousemove', handlers.ring.mousemove);
            x$.off('mouseup', handlers.ring.mouseup);
            return x$;
          }
        },
        triangle: {
          mousedown: function(e){
            var ref$, x, y, x$;
            ref$ = $canvas.offset(), x = ref$.left, y = ref$.top;
            x = e.pageX - x - ringWidth;
            y = e.pageY - y - ringWidth;
            if (this$.state.triangle.hitTest(x, y)) {
              handlers.triangle.mousemove(e);
              x$ = $top;
              x$.mousemove(handlers.triangle.mousemove);
              x$.mouseup(handlers.triangle.mouseup);
              return x$;
            }
          },
          mousemove: function(e){
            var ref$, x, y, s, v;
            ref$ = $canvas.offset(), x = ref$.left, y = ref$.top;
            x = e.pageX - x - ringWidth;
            y = e.pageY - y - ringWidth;
            ref$ = this$.state.triangle.SVFromPosition(x, y), s = ref$.s, v = ref$.v;
            return this$.props.onColorChange({
              h: this$.props.h,
              s: s,
              v: v
            });
          },
          mouseup: function(){
            var x$;
            x$ = $top;
            x$.off('mousemove', handlers.triangle.mousemove);
            x$.off('mouseup', handlers.triangle.mouseup);
            return x$;
          }
        }
      };
      z$ = $canvas;
      z$.mousedown(handlers.ring.mousedown);
      z$.mousedown(handlers.triangle.mousedown);
      return requestAnimationFrame(function(){
        return this$.update(this$.props);
      });
    },
    componentWillReceiveProps: function(nprops){
      var this$ = this;
      return requestAnimationFrame(function(){
        return this$.update(nprops);
      });
    },
    shouldComponentUpdate: function(nprops, nstate){
      return false;
    },
    update: function(props){
      var outer, inner, h, s, v, ringWidth, ref$, ring, triangle, x$, dim, c, y$, ctx, z$;
      outer = props.outer, inner = props.inner, h = props.h, s = props.s, v = props.v;
      ringWidth = outer - inner;
      ref$ = this.state, ring = ref$.ring, triangle = ref$.triangle;
      if (props === this.props || this.props.h !== h) {
        x$ = triangle;
        x$.hue = h;
        x$.rotation = ring.rotation + toRadian(h);
        x$.paint();
      }
      if (ring.dirty) {
        ring.paint();
      }
      if (props === this.props || this.props.outer !== outer || this.props.inner !== inner) {
        dim = 2 * outer;
        c = this.refs.canvas.getDOMNode();
        y$ = c;
        y$.width = dim;
        y$.height = dim;
        ctx = c.getContext('2d');
        z$ = ctx;
        z$.drawImage(ring.domElement, 0, 0);
        z$.drawImage(triangle.domElement, ringWidth, ringWidth);
        return z$;
      }
    },
    render: function(){
      return canvas({
        className: 'colorpicker',
        ref: 'canvas'
      });
    }
  });
  module.exports = ColorPicker;
}).call(this);
