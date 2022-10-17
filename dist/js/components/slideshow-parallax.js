/*! UIkit 3.15.10 | https://www.getuikit.com | (c) 2014 - 2022 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('uikit-util')) :
    typeof define === 'function' && define.amd ? define('uikitslideshow_parallax', ['uikit-util'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.UIkitSlideshow_parallax = factory(global.UIkit.util));
})(this, (function (uikitUtil) { 'use strict';

    var Media = {
      props: {
        media: Boolean },


      data: {
        media: false },


      connected() {
        const media = toMedia(this.media, this.$el);
        this.matchMedia = true;
        if (media) {
          this.mediaObj = window.matchMedia(media);
          const handler = () => {
            this.matchMedia = this.mediaObj.matches;
            uikitUtil.trigger(this.$el, uikitUtil.createEvent('mediachange', false, true, [this.mediaObj]));
          };
          this.offMediaObj = uikitUtil.on(this.mediaObj, 'change', () => {
            handler();
            this.$emit('resize');
          });
          handler();
        }
      },

      disconnected() {var _this$offMediaObj;
        (_this$offMediaObj = this.offMediaObj) == null ? void 0 : _this$offMediaObj.call(this);
      } };


    function toMedia(value, element) {
      if (uikitUtil.isString(value)) {
        if (uikitUtil.startsWith(value, '@')) {
          value = uikitUtil.toFloat(uikitUtil.css(element, "--uk-breakpoint-" + value.substr(1)));
        } else if (isNaN(value)) {
          return value;
        }
      }

      return value && uikitUtil.isNumeric(value) ? "(min-width: " + value + "px)" : '';
    }

    uikitUtil.memoize(async (src) => {
      if (src) {
        if (uikitUtil.startsWith(src, 'data:')) {
          return decodeURIComponent(src.split(',')[1]);
        } else {
          return (await fetch(src)).text();
        }
      } else {
        return Promise.reject();
      }
    });

    function getMaxPathLength(el) {
      return Math.ceil(
      Math.max(
      0,
      ...uikitUtil.$$('[stroke]', el).map((stroke) => {
        try {
          return stroke.getTotalLength();
        } catch (e) {
          return 0;
        }
      })));


    }

    const props = {
      x: transformFn,
      y: transformFn,
      rotate: transformFn,
      scale: transformFn,
      color: colorFn,
      backgroundColor: colorFn,
      borderColor: colorFn,
      blur: filterFn,
      hue: filterFn,
      fopacity: filterFn,
      grayscale: filterFn,
      invert: filterFn,
      saturate: filterFn,
      sepia: filterFn,
      opacity: cssPropFn,
      stroke: strokeFn,
      bgx: backgroundFn,
      bgy: backgroundFn };


    const { keys } = Object;

    var Parallax = {
      mixins: [Media],

      props: fillObject(keys(props), 'list'),

      data: fillObject(keys(props), undefined),

      computed: {
        props(properties, $el) {
          const stops = {};
          for (const prop in properties) {
            if (prop in props && !uikitUtil.isUndefined(properties[prop])) {
              stops[prop] = properties[prop].slice();
            }
          }
          const result = {};
          for (const prop in stops) {
            result[prop] = props[prop](prop, $el, stops[prop], stops);
          }
          return result;
        } },


      events: {
        load() {
          this.$emit();
        } },


      methods: {
        reset() {
          for (const prop in this.getCss(0)) {
            uikitUtil.css(this.$el, prop, '');
          }
        },

        getCss(percent) {
          const css = { transform: '', filter: '' };
          for (const prop in this.props) {
            this.props[prop](css, percent);
          }
          return css;
        } } };



    function transformFn(prop, el, stops) {
      let unit = getUnit(stops) || { x: 'px', y: 'px', rotate: 'deg' }[prop] || '';
      let transformFn;

      if (prop === 'x' || prop === 'y') {
        prop = "translate" + uikitUtil.ucfirst(prop);
        transformFn = (stop) => uikitUtil.toFloat(uikitUtil.toFloat(stop).toFixed(unit === 'px' ? 0 : 6));
      } else if (prop === 'scale') {
        unit = '';
        transformFn = (stop) =>
        getUnit([stop]) ? uikitUtil.toPx(stop, 'width', el, true) / el.offsetWidth : stop;
      }

      if (stops.length === 1) {
        stops.unshift(prop === 'scale' ? 1 : 0);
      }

      stops = parseStops(stops, transformFn);

      return (css, percent) => {
        css.transform += " " + prop + "(" + getValue(stops, percent) + unit + ")";
      };
    }

    function colorFn(prop, el, stops) {
      if (stops.length === 1) {
        stops.unshift(getCssValue(el, prop, ''));
      }

      stops = parseStops(stops, (stop) => parseColor(el, stop));

      return (css, percent) => {
        const [start, end, p] = getStop(stops, percent);
        const value = start.
        map((value, i) => {
          value += p * (end[i] - value);
          return i === 3 ? uikitUtil.toFloat(value) : parseInt(value, 10);
        }).
        join(',');
        css[prop] = "rgba(" + value + ")";
      };
    }

    function parseColor(el, color) {
      return getCssValue(el, 'color', color).
      split(/[(),]/g).
      slice(1, -1).
      concat(1).
      slice(0, 4).
      map(uikitUtil.toFloat);
    }

    function filterFn(prop, el, stops) {
      if (stops.length === 1) {
        stops.unshift(0);
      }

      const unit = getUnit(stops) || { blur: 'px', hue: 'deg' }[prop] || '%';
      prop = { fopacity: 'opacity', hue: 'hue-rotate' }[prop] || prop;
      stops = parseStops(stops);

      return (css, percent) => {
        const value = getValue(stops, percent);
        css.filter += " " + prop + "(" + (value + unit) + ")";
      };
    }

    function cssPropFn(prop, el, stops) {
      if (stops.length === 1) {
        stops.unshift(getCssValue(el, prop, ''));
      }

      stops = parseStops(stops);

      return (css, percent) => {
        css[prop] = getValue(stops, percent);
      };
    }

    function strokeFn(prop, el, stops) {
      if (stops.length === 1) {
        stops.unshift(0);
      }

      const unit = getUnit(stops);
      const length = getMaxPathLength(el);
      stops = parseStops(stops.reverse(), (stop) => {
        stop = uikitUtil.toFloat(stop);
        return unit === '%' ? stop * length / 100 : stop;
      });

      if (!stops.some((_ref) => {let [value] = _ref;return value;})) {
        return uikitUtil.noop;
      }

      uikitUtil.css(el, 'strokeDasharray', length);

      return (css, percent) => {
        css.strokeDashoffset = getValue(stops, percent);
      };
    }

    function backgroundFn(prop, el, stops, props) {
      if (stops.length === 1) {
        stops.unshift(0);
      }

      const attr = prop === 'bgy' ? 'height' : 'width';
      props[prop] = parseStops(stops, (stop) => uikitUtil.toPx(stop, attr, el));

      const bgProps = ['bgx', 'bgy'].filter((prop) => prop in props);
      if (bgProps.length === 2 && prop === 'bgx') {
        return uikitUtil.noop;
      }

      if (getCssValue(el, 'backgroundSize', '') === 'cover') {
        return backgroundCoverFn(prop, el, stops, props);
      }

      const positions = {};
      for (const prop of bgProps) {
        positions[prop] = getBackgroundPos(el, prop);
      }

      return setBackgroundPosFn(bgProps, positions, props);
    }

    function backgroundCoverFn(prop, el, stops, props) {
      const dimImage = getBackgroundImageDimensions(el);

      if (!dimImage.width) {
        return uikitUtil.noop;
      }

      const dimEl = {
        width: el.offsetWidth,
        height: el.offsetHeight };


      const bgProps = ['bgx', 'bgy'].filter((prop) => prop in props);

      const positions = {};
      for (const prop of bgProps) {
        const values = props[prop].map((_ref2) => {let [value] = _ref2;return value;});
        const min = Math.min(...values);
        const max = Math.max(...values);
        const down = values.indexOf(min) < values.indexOf(max);
        const diff = max - min;

        positions[prop] = (down ? -diff : 0) - (down ? min : max) + "px";
        dimEl[prop === 'bgy' ? 'height' : 'width'] += diff;
      }

      const dim = uikitUtil.Dimensions.cover(dimImage, dimEl);

      for (const prop of bgProps) {
        const attr = prop === 'bgy' ? 'height' : 'width';
        const overflow = dim[attr] - dimEl[attr];
        positions[prop] = "max(" + getBackgroundPos(el, prop) + ",-" + overflow + "px) + " + positions[prop];
      }

      const fn = setBackgroundPosFn(bgProps, positions, props);
      return (css, percent) => {
        fn(css, percent);
        css.backgroundSize = dim.width + "px " + dim.height + "px";
        css.backgroundRepeat = 'no-repeat';
      };
    }

    function getBackgroundPos(el, prop) {
      return getCssValue(el, "background-position-" + prop.substr(-1), '');
    }

    function setBackgroundPosFn(bgProps, positions, props) {
      return function (css, percent) {
        for (const prop of bgProps) {
          const value = getValue(props[prop], percent);
          css["background-position-" + prop.substr(-1)] = "calc(" + positions[prop] + " + " + value + "px)";
        }
      };
    }

    const dimensions = {};
    function getBackgroundImageDimensions(el) {
      const src = uikitUtil.css(el, 'backgroundImage').replace(/^none|url\(["']?(.+?)["']?\)$/, '$1');

      if (dimensions[src]) {
        return dimensions[src];
      }

      const image = new Image();
      if (src) {
        image.src = src;

        if (!image.naturalWidth) {
          image.onload = () => {
            dimensions[src] = toDimensions(image);
            uikitUtil.trigger(el, uikitUtil.createEvent('load', false));
          };
          return toDimensions(image);
        }
      }

      return dimensions[src] = toDimensions(image);
    }

    function toDimensions(image) {
      return {
        width: image.naturalWidth,
        height: image.naturalHeight };

    }

    function parseStops(stops, fn) {if (fn === void 0) {fn = uikitUtil.toFloat;}
      const result = [];
      const { length } = stops;
      let nullIndex = 0;
      for (let i = 0; i < length; i++) {
        let [value, percent] = uikitUtil.isString(stops[i]) ? stops[i].trim().split(' ') : [stops[i]];
        value = fn(value);
        percent = percent ? uikitUtil.toFloat(percent) / 100 : null;

        if (i === 0) {
          if (percent === null) {
            percent = 0;
          } else if (percent) {
            result.push([value, 0]);
          }
        } else if (i === length - 1) {
          if (percent === null) {
            percent = 1;
          } else if (percent !== 1) {
            result.push([value, percent]);
            percent = 1;
          }
        }

        result.push([value, percent]);

        if (percent === null) {
          nullIndex++;
        } else if (nullIndex) {
          const leftPercent = result[i - nullIndex - 1][1];
          const p = (percent - leftPercent) / (nullIndex + 1);
          for (let j = nullIndex; j > 0; j--) {
            result[i - j][1] = leftPercent + p * (nullIndex - j + 1);
          }

          nullIndex = 0;
        }
      }

      return result;
    }

    function getStop(stops, percent) {
      const index = uikitUtil.findIndex(stops.slice(1), (_ref3) => {let [, targetPercent] = _ref3;return percent <= targetPercent;}) + 1;
      return [
      stops[index - 1][0],
      stops[index][0],
      (percent - stops[index - 1][1]) / (stops[index][1] - stops[index - 1][1])];

    }

    function getValue(stops, percent) {
      const [start, end, p] = getStop(stops, percent);
      return uikitUtil.isNumber(start) ? start + Math.abs(start - end) * p * (start < end ? 1 : -1) : +end;
    }

    const unitRe = /^-?\d+(\S+)/;
    function getUnit(stops, defaultUnit) {
      for (const stop of stops) {
        const match = stop.match == null ? void 0 : stop.match(unitRe);
        if (match) {
          return match[1];
        }
      }
      return defaultUnit;
    }

    function getCssValue(el, prop, value) {
      const prev = el.style[prop];
      const val = uikitUtil.css(uikitUtil.css(el, prop, value), prop);
      el.style[prop] = prev;
      return val;
    }

    function fillObject(keys, value) {
      return keys.reduce((data, prop) => {
        data[prop] = value;
        return data;
      }, {});
    }

    var Component = {
      mixins: [Parallax],

      data: {
        selItem: '!li' },


      beforeConnect() {
        this.item = uikitUtil.query(this.selItem, this.$el);
      },

      disconnected() {
        this.item = null;
      },

      events: [
      {
        name: 'itemin itemout',

        self: true,

        el() {
          return this.item;
        },

        handler(_ref) {let { type, detail: { percent, duration, timing, dir } } = _ref;
          uikitUtil.fastdom.read(() => {
            const propsFrom = this.getCss(getCurrentPercent(type, dir, percent));
            const propsTo = this.getCss(isIn(type) ? 0.5 : dir > 0 ? 1 : 0);
            uikitUtil.fastdom.write(() => {
              uikitUtil.css(this.$el, propsFrom);
              uikitUtil.Transition.start(this.$el, propsTo, duration, timing).catch(uikitUtil.noop);
            });
          });
        } },


      {
        name: 'transitioncanceled transitionend',

        self: true,

        el() {
          return this.item;
        },

        handler() {
          uikitUtil.Transition.cancel(this.$el);
        } },


      {
        name: 'itemtranslatein itemtranslateout',

        self: true,

        el() {
          return this.item;
        },

        handler(_ref2) {let { type, detail: { percent, dir } } = _ref2;
          uikitUtil.fastdom.read(() => {
            const props = this.getCss(getCurrentPercent(type, dir, percent));
            uikitUtil.fastdom.write(() => uikitUtil.css(this.$el, props));
          });
        } }] };




    function isIn(type) {
      return uikitUtil.endsWith(type, 'in');
    }

    function getCurrentPercent(type, dir, percent) {
      percent /= 2;

      return isIn(type) ^ dir < 0 ? percent : 1 - percent;
    }

    if (typeof window !== 'undefined' && window.UIkit) {
      window.UIkit.component('slideshowParallax', Component);
    }

    return Component;

}));
