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
        outer: 200,
        inner: 160,
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
      var ringWidth, x$, $top, $canvas, handlers, y$, this$ = this;
      ringWidth = this.props.outer - this.props.inner;
      x$ = this.state;
      x$.ring = new HueRing(this.props.outer, this.props.inner);
      x$.triangle = new HSVTriangle(this.props.inner);
      $top = $((function(){
        try {
          return document;
        } catch (e$) {}
      }()));
      $canvas = $(this.refs.canvas.getDOMNode());
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
      y$ = $canvas;
      y$.mousedown(handlers.ring.mousedown);
      y$.mousedown(handlers.triangle.mousedown);
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
