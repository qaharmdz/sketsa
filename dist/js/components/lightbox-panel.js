/*! UIkit 3.15.10 | https://www.getuikit.com | (c) 2014 - 2022 YOOtheme | MIT License */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('uikit-util')) :
    typeof define === 'function' && define.amd ? define('uikitlightbox_panel', ['uikit-util'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.UIkitLightbox_panel = factory(global.UIkit.util));
})(this, (function (uikitUtil) { 'use strict';

    var Animations$1 = {
      slide: {
        show(dir) {
          return [{ transform: translate(dir * -100) }, { transform: translate() }];
        },

        percent(current) {
          return translated(current);
        },

        translate(percent, dir) {
          return [
          { transform: translate(dir * -100 * percent) },
          { transform: translate(dir * 100 * (1 - percent)) }];

        } } };



    function translated(el) {
      return Math.abs(uikitUtil.css(el, 'transform').split(',')[4] / el.offsetWidth) || 0;
    }

    function translate(value, unit) {if (value === void 0) {value = 0;}if (unit === void 0) {unit = '%';}
      value += value ? unit : '';
      return "translate3d(" + value + ", 0, 0)";
    }

    function scale3d(value) {
      return "scale3d(" + value + ", " + value + ", 1)";
    }

    var Animations = {
      ...Animations$1,
      fade: {
        show() {
          return [{ opacity: 0 }, { opacity: 1 }];
        },

        percent(current) {
          return 1 - uikitUtil.css(current, 'opacity');
        },

        translate(percent) {
          return [{ opacity: 1 - percent }, { opacity: percent }];
        } },


      scale: {
        show() {
          return [
          { opacity: 0, transform: scale3d(1 - 0.2) },
          { opacity: 1, transform: scale3d(1) }];

        },

        percent(current) {
          return 1 - uikitUtil.css(current, 'opacity');
        },

        translate(percent) {
          return [
          { opacity: 1 - percent, transform: scale3d(1 - 0.2 * percent) },
          { opacity: percent, transform: scale3d(1 - 0.2 + 0.2 * percent) }];

        } } };

    var Container = {
      props: {
        container: Boolean },


      data: {
        container: true },


      computed: {
        container(_ref) {let { container } = _ref;
          return container === true && this.$container || container && uikitUtil.$(container);
        } } };

    var Class = {
      connected() {
        uikitUtil.addClass(this.$el, this.$options.id);
      } };

    var Togglable = {
      props: {
        cls: Boolean,
        animation: 'list',
        duration: Number,
        velocity: Number,
        origin: String,
        transition: String },


      data: {
        cls: false,
        animation: [false],
        duration: 200,
        velocity: 0.2,
        origin: false,
        transition: 'ease',
        clsEnter: 'uk-togglabe-enter',
        clsLeave: 'uk-togglabe-leave' },


      computed: {
        hasAnimation(_ref) {let { animation } = _ref;
          return !!animation[0];
        },

        hasTransition(_ref2) {let { animation } = _ref2;
          return ['slide', 'reveal'].some((transition) => uikitUtil.startsWith(animation[0], transition));
        } },


      methods: {
        toggleElement(targets, toggle, animate) {
          return new Promise((resolve) =>
          Promise.all(
          uikitUtil.toNodes(targets).map((el) => {
            const show = uikitUtil.isBoolean(toggle) ? toggle : !this.isToggled(el);

            if (!uikitUtil.trigger(el, "before" + (show ? 'show' : 'hide'), [this])) {
              return Promise.reject();
            }

            const promise = (
            uikitUtil.isFunction(animate) ?
            animate :
            animate === false || !this.hasAnimation ?
            toggleInstant :
            this.hasTransition ?
            toggleTransition :
            toggleAnimation)(
            el, show, this);

            const cls = show ? this.clsEnter : this.clsLeave;

            uikitUtil.addClass(el, cls);

            uikitUtil.trigger(el, show ? 'show' : 'hide', [this]);

            const done = () => {
              uikitUtil.removeClass(el, cls);
              uikitUtil.trigger(el, show ? 'shown' : 'hidden', [this]);
            };

            return promise ?
            promise.then(done, () => {
              uikitUtil.removeClass(el, cls);
              return Promise.reject();
            }) :
            done();
          })).
          then(resolve, uikitUtil.noop));

        },

        isToggled(el) {if (el === void 0) {el = this.$el;}
          [el] = uikitUtil.toNodes(el);
          return uikitUtil.hasClass(el, this.clsEnter) ?
          true :
          uikitUtil.hasClass(el, this.clsLeave) ?
          false :
          this.cls ?
          uikitUtil.hasClass(el, this.cls.split(' ')[0]) :
          uikitUtil.isVisible(el);
        },

        _toggle(el, toggled) {
          if (!el) {
            return;
          }

          toggled = Boolean(toggled);

          let changed;
          if (this.cls) {
            changed = uikitUtil.includes(this.cls, ' ') || toggled !== uikitUtil.hasClass(el, this.cls);
            changed && uikitUtil.toggleClass(el, this.cls, uikitUtil.includes(this.cls, ' ') ? undefined : toggled);
          } else {
            changed = toggled === el.hidden;
            changed && (el.hidden = !toggled);
          }

          uikitUtil.$$('[autofocus]', el).some((el) => uikitUtil.isVisible(el) ? el.focus() || true : el.blur());

          if (changed) {
            uikitUtil.trigger(el, 'toggled', [toggled, this]);
          }
        } } };



    function toggleInstant(el, show, _ref3) {let { _toggle } = _ref3;
      uikitUtil.Animation.cancel(el);
      uikitUtil.Transition.cancel(el);
      return _toggle(el, show);
    }

    async function toggleTransition(
    el,
    show, _ref4)

    {var _animation$;let { animation, duration, velocity, transition, _toggle } = _ref4;
      const [mode = 'reveal', startProp = 'top'] = ((_animation$ = animation[0]) == null ? void 0 : _animation$.split('-')) || [];

      const dirs = [
      ['left', 'right'],
      ['top', 'bottom']];

      const dir = dirs[uikitUtil.includes(dirs[0], startProp) ? 0 : 1];
      const end = dir[1] === startProp;
      const props = ['width', 'height'];
      const dimProp = props[dirs.indexOf(dir)];
      const marginProp = "margin-" + dir[0];
      const marginStartProp = "margin-" + startProp;

      let currentDim = uikitUtil.dimensions(el)[dimProp];

      const inProgress = uikitUtil.Transition.inProgress(el);
      await uikitUtil.Transition.cancel(el);

      if (show) {
        _toggle(el, true);
      }

      const prevProps = Object.fromEntries(
      [
      'padding',
      'border',
      'width',
      'height',
      'minWidth',
      'minHeight',
      'overflowY',
      'overflowX',
      marginProp,
      marginStartProp].
      map((key) => [key, el.style[key]]));


      const dim = uikitUtil.dimensions(el);
      const currentMargin = uikitUtil.toFloat(uikitUtil.css(el, marginProp));
      const marginStart = uikitUtil.toFloat(uikitUtil.css(el, marginStartProp));
      const endDim = dim[dimProp] + marginStart;

      if (!inProgress && !show) {
        currentDim += marginStart;
      }

      const [wrapper] = uikitUtil.wrapInner(el, '<div>');
      uikitUtil.css(wrapper, {
        boxSizing: 'border-box',
        height: dim.height,
        width: dim.width,
        ...uikitUtil.css(el, [
        'overflow',
        'padding',
        'borderTop',
        'borderRight',
        'borderBottom',
        'borderLeft',
        'borderImage',
        marginStartProp]) });



      uikitUtil.css(el, {
        padding: 0,
        border: 0,
        minWidth: 0,
        minHeight: 0,
        [marginStartProp]: 0,
        width: dim.width,
        height: dim.height,
        overflow: 'hidden',
        [dimProp]: currentDim });


      const percent = currentDim / endDim;
      duration = (velocity * endDim + duration) * (show ? 1 - percent : percent);
      const endProps = { [dimProp]: show ? endDim : 0 };

      if (end) {
        uikitUtil.css(el, marginProp, endDim - currentDim + currentMargin);
        endProps[marginProp] = show ? currentMargin : endDim + currentMargin;
      }

      if (!end ^ mode === 'reveal') {
        uikitUtil.css(wrapper, marginProp, -endDim + currentDim);
        uikitUtil.Transition.start(wrapper, { [marginProp]: show ? 0 : -endDim }, duration, transition);
      }

      try {
        await uikitUtil.Transition.start(el, endProps, duration, transition);
      } finally {
        uikitUtil.css(el, prevProps);
        uikitUtil.unwrap(wrapper.firstChild);

        if (!show) {
          _toggle(el, false);
        }
      }
    }

    function toggleAnimation(el, show, cmp) {
      uikitUtil.Animation.cancel(el);

      const { animation, duration, _toggle } = cmp;

      if (show) {
        _toggle(el, true);
        return uikitUtil.Animation.in(el, animation[0], duration, cmp.origin);
      }

      return uikitUtil.Animation.out(el, animation[1] || animation[0], duration, cmp.origin).then(() =>
      _toggle(el, false));

    }

    const active = [];

    var Modal = {
      mixins: [Class, Container, Togglable],

      props: {
        selPanel: String,
        selClose: String,
        escClose: Boolean,
        bgClose: Boolean,
        stack: Boolean },


      data: {
        cls: 'uk-open',
        escClose: true,
        bgClose: true,
        overlay: true,
        stack: false },


      computed: {
        panel(_ref, $el) {let { selPanel } = _ref;
          return uikitUtil.$(selPanel, $el);
        },

        transitionElement() {
          return this.panel;
        },

        bgClose(_ref2) {let { bgClose } = _ref2;
          return bgClose && this.panel;
        } },


      beforeDisconnect() {
        if (uikitUtil.includes(active, this)) {
          this.toggleElement(this.$el, false, false);
        }
      },

      events: [
      {
        name: 'click',

        delegate() {
          return this.selClose;
        },

        handler(e) {
          e.preventDefault();
          this.hide();
        } },


      {
        name: 'click',

        delegate() {
          return 'a[href*="#"]';
        },

        handler(_ref3) {let { current, defaultPrevented } = _ref3;
          const { hash } = current;
          if (
          !defaultPrevented &&
          hash &&
          isSameSiteAnchor(current) &&
          !uikitUtil.within(hash, this.$el) &&
          uikitUtil.$(hash, document.body))
          {
            this.hide();
          }
        } },


      {
        name: 'toggle',

        self: true,

        handler(e) {
          if (e.defaultPrevented) {
            return;
          }

          e.preventDefault();

          if (this.isToggled() === uikitUtil.includes(active, this)) {
            this.toggle();
          }
        } },


      {
        name: 'beforeshow',

        self: true,

        handler(e) {
          if (uikitUtil.includes(active, this)) {
            return false;
          }

          if (!this.stack && active.length) {
            Promise.all(active.map((modal) => modal.hide())).then(this.show);
            e.preventDefault();
          } else {
            active.push(this);
          }
        } },


      {
        name: 'show',

        self: true,

        handler() {
          uikitUtil.once(
          this.$el,
          'hide',
          uikitUtil.on(document, 'focusin', (e) => {
            if (uikitUtil.last(active) === this && !uikitUtil.within(e.target, this.$el)) {
              this.$el.focus();
            }
          }));


          if (this.overlay) {
            uikitUtil.once(this.$el, 'hidden', preventOverscroll(this.$el), { self: true });
            uikitUtil.once(this.$el, 'hidden', preventBackgroundScroll(), { self: true });
          }

          if (this.stack) {
            uikitUtil.css(this.$el, 'zIndex', uikitUtil.toFloat(uikitUtil.css(this.$el, 'zIndex')) + active.length);
          }

          uikitUtil.addClass(document.documentElement, this.clsPage);

          if (this.bgClose) {
            uikitUtil.once(
            this.$el,
            'hide',
            uikitUtil.on(document, uikitUtil.pointerDown, (_ref4) => {let { target } = _ref4;
              if (
              uikitUtil.last(active) !== this ||
              this.overlay && !uikitUtil.within(target, this.$el) ||
              uikitUtil.within(target, this.panel))
              {
                return;
              }

              uikitUtil.once(
              document,
              uikitUtil.pointerUp + " " + uikitUtil.pointerCancel + " scroll",
              (_ref5) => {let { defaultPrevented, type, target: newTarget } = _ref5;
                if (
                !defaultPrevented &&
                type === uikitUtil.pointerUp &&
                target === newTarget)
                {
                  this.hide();
                }
              },
              true);

            }),
            { self: true });

          }

          if (this.escClose) {
            uikitUtil.once(
            this.$el,
            'hide',
            uikitUtil.on(document, 'keydown', (e) => {
              if (e.keyCode === 27 && uikitUtil.last(active) === this) {
                this.hide();
              }
            }),
            { self: true });

          }
        } },


      {
        name: 'shown',

        self: true,

        handler() {
          if (!uikitUtil.isFocusable(this.$el)) {
            uikitUtil.attr(this.$el, 'tabindex', '-1');
          }

          if (!uikitUtil.$(':focus', this.$el)) {
            this.$el.focus();
          }
        } },


      {
        name: 'hidden',

        self: true,

        handler() {
          if (uikitUtil.includes(active, this)) {
            active.splice(active.indexOf(this), 1);
          }

          uikitUtil.css(this.$el, 'zIndex', '');

          if (!active.some((modal) => modal.clsPage === this.clsPage)) {
            uikitUtil.removeClass(document.documentElement, this.clsPage);
          }
        } }],



      methods: {
        toggle() {
          return this.isToggled() ? this.hide() : this.show();
        },

        show() {
          if (this.container && uikitUtil.parent(this.$el) !== this.container) {
            uikitUtil.append(this.container, this.$el);
            return new Promise((resolve) =>
            requestAnimationFrame(() => this.show().then(resolve)));

          }

          return this.toggleElement(this.$el, true, animate);
        },

        hide() {
          return this.toggleElement(this.$el, false, animate);
        } } };



    function animate(el, show, _ref6) {let { transitionElement, _toggle } = _ref6;
      return new Promise((resolve, reject) =>
      uikitUtil.once(el, 'show hide', () => {
        el._reject == null ? void 0 : el._reject();
        el._reject = reject;

        _toggle(el, show);

        const off = uikitUtil.once(
        transitionElement,
        'transitionstart',
        () => {
          uikitUtil.once(transitionElement, 'transitionend transitioncancel', resolve, {
            self: true });

          clearTimeout(timer);
        },
        { self: true });


        const timer = setTimeout(() => {
          off();
          resolve();
        }, toMs(uikitUtil.css(transitionElement, 'transitionDuration')));
      })).
      then(() => delete el._reject);
    }

    function toMs(time) {
      return time ? uikitUtil.endsWith(time, 'ms') ? uikitUtil.toFloat(time) : uikitUtil.toFloat(time) * 1000 : 0;
    }

    function preventOverscroll(el) {
      if (CSS.supports('overscroll-behavior', 'contain')) {
        const elements = filterChildren(el, (child) => /auto|scroll/.test(uikitUtil.css(child, 'overflow')));
        uikitUtil.css(elements, 'overscrollBehavior', 'contain');
        return () => uikitUtil.css(elements, 'overscrollBehavior', '');
      }

      let startClientY;

      const events = [
      uikitUtil.on(
      el,
      'touchstart',
      (_ref7) => {let { targetTouches } = _ref7;
        if (targetTouches.length === 1) {
          startClientY = targetTouches[0].clientY;
        }
      },
      { passive: true }),


      uikitUtil.on(
      el,
      'touchmove',
      (e) => {
        if (e.targetTouches.length !== 1) {
          return;
        }

        let [scrollParent] = uikitUtil.scrollParents(e.target, /auto|scroll/);
        if (!uikitUtil.within(scrollParent, el)) {
          scrollParent = el;
        }

        const clientY = e.targetTouches[0].clientY - startClientY;
        const { scrollTop, scrollHeight, clientHeight } = scrollParent;

        if (
        clientHeight >= scrollHeight ||
        scrollTop === 0 && clientY > 0 ||
        scrollHeight - scrollTop <= clientHeight && clientY < 0)
        {
          e.cancelable && e.preventDefault();
        }
      },
      { passive: false })];



      return () => events.forEach((fn) => fn());
    }

    let prevented;
    function preventBackgroundScroll() {
      if (prevented) {
        return uikitUtil.noop;
      }
      prevented = true;

      const { scrollingElement } = document;
      uikitUtil.css(scrollingElement, {
        overflowY: 'hidden',
        touchAction: 'none',
        paddingRight: uikitUtil.width(window) - scrollingElement.clientWidth });

      return () => {
        prevented = false;
        uikitUtil.css(scrollingElement, { overflowY: '', touchAction: '', paddingRight: '' });
      };
    }

    function filterChildren(el, fn) {
      const children = [];
      uikitUtil.apply(el, (node) => {
        if (fn(node)) {
          children.push(node);
        }
      });
      return children;
    }

    function isSameSiteAnchor(a) {
      return ['origin', 'pathname', 'search'].every((part) => a[part] === location[part]);
    }

    function Transitioner(prev, next, dir, _ref) {let { animation, easing } = _ref;
      const { percent, translate, show = uikitUtil.noop } = animation;
      const props = show(dir);
      const deferred = new uikitUtil.Deferred();

      return {
        dir,

        show(duration, percent, linear) {if (percent === void 0) {percent = 0;}
          const timing = linear ? 'linear' : easing;
          duration -= Math.round(duration * uikitUtil.clamp(percent, -1, 1));

          this.translate(percent);

          triggerUpdate(next, 'itemin', { percent, duration, timing, dir });
          triggerUpdate(prev, 'itemout', { percent: 1 - percent, duration, timing, dir });

          Promise.all([
          uikitUtil.Transition.start(next, props[1], duration, timing),
          uikitUtil.Transition.start(prev, props[0], duration, timing)]).
          then(() => {
            this.reset();
            deferred.resolve();
          }, uikitUtil.noop);

          return deferred.promise;
        },

        cancel() {
          uikitUtil.Transition.cancel([next, prev]);
        },

        reset() {
          for (const prop in props[0]) {
            uikitUtil.css([next, prev], prop, '');
          }
        },

        forward(duration, percent) {if (percent === void 0) {percent = this.percent();}
          uikitUtil.Transition.cancel([next, prev]);
          return this.show(duration, percent, true);
        },

        translate(percent) {
          this.reset();

          const props = translate(percent, dir);
          uikitUtil.css(next, props[1]);
          uikitUtil.css(prev, props[0]);
          triggerUpdate(next, 'itemtranslatein', { percent, dir });
          triggerUpdate(prev, 'itemtranslateout', { percent: 1 - percent, dir });
        },

        percent() {
          return percent(prev || next, next, dir);
        },

        getDistance() {
          return prev == null ? void 0 : prev.offsetWidth;
        } };

    }

    function triggerUpdate(el, type, data) {
      uikitUtil.trigger(el, uikitUtil.createEvent(type, false, false, data));
    }

    var Resize = {
      connected() {var _this$$options$resize;
        this.registerObserver(
        uikitUtil.observeResize(((_this$$options$resize = this.$options.resizeTargets) == null ? void 0 : _this$$options$resize.call(this)) || this.$el, () =>
        this.$emit('resize')));


      } };

    var SliderAutoplay = {
      props: {
        autoplay: Boolean,
        autoplayInterval: Number,
        pauseOnHover: Boolean },


      data: {
        autoplay: false,
        autoplayInterval: 7000,
        pauseOnHover: true },


      connected() {
        this.autoplay && this.startAutoplay();
      },

      disconnected() {
        this.stopAutoplay();
      },

      update() {
        uikitUtil.attr(this.slides, 'tabindex', '-1');
      },

      events: [
      {
        name: 'visibilitychange',

        el() {
          return document;
        },

        filter() {
          return this.autoplay;
        },

        handler() {
          if (document.hidden) {
            this.stopAutoplay();
          } else {
            this.startAutoplay();
          }
        } }],



      methods: {
        startAutoplay() {
          this.stopAutoplay();

          this.interval = setInterval(
          () =>
          (!this.draggable || !uikitUtil.$(':focus', this.$el)) && (
          !this.pauseOnHover || !uikitUtil.matches(this.$el, ':hover')) &&
          !this.stack.length &&
          this.show('next'),
          this.autoplayInterval);

        },

        stopAutoplay() {
          this.interval && clearInterval(this.interval);
        } } };

    const pointerOptions = { passive: false, capture: true };
    const pointerUpOptions = { passive: true, capture: true };
    const pointerDown = 'touchstart mousedown';
    const pointerMove = 'touchmove mousemove';
    const pointerUp = 'touchend touchcancel mouseup click input scroll';

    var SliderDrag = {
      props: {
        draggable: Boolean },


      data: {
        draggable: true,
        threshold: 10 },


      created() {
        for (const key of ['start', 'move', 'end']) {
          const fn = this[key];
          this[key] = (e) => {
            const pos = uikitUtil.getEventPos(e).x * (uikitUtil.isRtl ? -1 : 1);

            this.prevPos = pos === this.pos ? this.prevPos : this.pos;
            this.pos = pos;

            fn(e);
          };
        }
      },

      events: [
      {
        name: pointerDown,

        passive: true,

        delegate() {
          return this.selSlides;
        },

        handler(e) {
          if (
          !this.draggable ||
          !uikitUtil.isTouch(e) && hasSelectableText(e.target) ||
          uikitUtil.closest(e.target, uikitUtil.selInput) ||
          e.button > 0 ||
          this.length < 2)
          {
            return;
          }

          this.start(e);
        } },


      {
        name: 'dragstart',

        handler(e) {
          e.preventDefault();
        } },


      {
        // iOS workaround for slider stopping if swiping fast
        name: pointerMove,
        el() {
          return this.list;
        },
        handler: uikitUtil.noop,
        ...pointerOptions }],



      methods: {
        start() {
          this.drag = this.pos;

          if (this._transitioner) {
            this.percent = this._transitioner.percent();
            this.drag += this._transitioner.getDistance() * this.percent * this.dir;

            this._transitioner.cancel();
            this._transitioner.translate(this.percent);

            this.dragging = true;

            this.stack = [];
          } else {
            this.prevIndex = this.index;
          }

          uikitUtil.on(document, pointerMove, this.move, pointerOptions);

          // 'input' event is triggered by video controls
          uikitUtil.on(document, pointerUp, this.end, pointerUpOptions);

          uikitUtil.css(this.list, 'userSelect', 'none');
        },

        move(e) {
          const distance = this.pos - this.drag;

          if (
          distance === 0 ||
          this.prevPos === this.pos ||
          !this.dragging && Math.abs(distance) < this.threshold)
          {
            return;
          }

          // prevent click event
          uikitUtil.css(this.list, 'pointerEvents', 'none');

          e.cancelable && e.preventDefault();

          this.dragging = true;
          this.dir = distance < 0 ? 1 : -1;

          const { slides } = this;
          let { prevIndex } = this;
          let dis = Math.abs(distance);
          let nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
          let width = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;

          while (nextIndex !== prevIndex && dis > width) {
            this.drag -= width * this.dir;

            prevIndex = nextIndex;
            dis -= width;
            nextIndex = this.getIndex(prevIndex + this.dir, prevIndex);
            width = this._getDistance(prevIndex, nextIndex) || slides[prevIndex].offsetWidth;
          }

          this.percent = dis / width;

          const prev = slides[prevIndex];
          const next = slides[nextIndex];
          const changed = this.index !== nextIndex;
          const edge = prevIndex === nextIndex;

          let itemShown;

          [this.index, this.prevIndex].
          filter((i) => !uikitUtil.includes([nextIndex, prevIndex], i)).
          forEach((i) => {
            uikitUtil.trigger(slides[i], 'itemhidden', [this]);

            if (edge) {
              itemShown = true;
              this.prevIndex = prevIndex;
            }
          });

          if (this.index === prevIndex && this.prevIndex !== prevIndex || itemShown) {
            uikitUtil.trigger(slides[this.index], 'itemshown', [this]);
          }

          if (changed) {
            this.prevIndex = prevIndex;
            this.index = nextIndex;

            !edge && uikitUtil.trigger(prev, 'beforeitemhide', [this]);
            uikitUtil.trigger(next, 'beforeitemshow', [this]);
          }

          this._transitioner = this._translate(Math.abs(this.percent), prev, !edge && next);

          if (changed) {
            !edge && uikitUtil.trigger(prev, 'itemhide', [this]);
            uikitUtil.trigger(next, 'itemshow', [this]);
          }
        },

        end() {
          uikitUtil.off(document, pointerMove, this.move, pointerOptions);
          uikitUtil.off(document, pointerUp, this.end, pointerUpOptions);

          if (this.dragging) {
            this.dragging = null;

            if (this.index === this.prevIndex) {
              this.percent = 1 - this.percent;
              this.dir *= -1;
              this._show(false, this.index, true);
              this._transitioner = null;
            } else {
              const dirChange =
              (uikitUtil.isRtl ? this.dir * (uikitUtil.isRtl ? 1 : -1) : this.dir) < 0 ===
              this.prevPos > this.pos;
              this.index = dirChange ? this.index : this.prevIndex;

              if (dirChange) {
                this.percent = 1 - this.percent;
              }

              this.show(
              this.dir > 0 && !dirChange || this.dir < 0 && dirChange ?
              'next' :
              'previous',
              true);

            }
          }

          uikitUtil.css(this.list, { userSelect: '', pointerEvents: '' });

          this.drag = this.percent = null;
        } } };



    function hasSelectableText(el) {
      return (
        uikitUtil.css(el, 'userSelect') !== 'none' &&
        uikitUtil.toNodes(el.childNodes).some((el) => el.nodeType === 3 && el.textContent.trim()));

    }

    var SliderNav = {
      data: {
        selNav: false },


      computed: {
        nav(_ref, $el) {let { selNav } = _ref;
          return uikitUtil.$(selNav, $el);
        },

        selNavItem(_ref2) {let { attrItem } = _ref2;
          return "[" + attrItem + "],[data-" + attrItem + "]";
        },

        navItems(_, $el) {
          return uikitUtil.$$(this.selNavItem, $el);
        } },


      update: {
        write() {
          if (this.nav && this.length !== this.nav.children.length) {
            uikitUtil.html(
            this.nav,
            this.slides.
            map((_, i) => "<li " + this.attrItem + "=\"" + i + "\"><a href></a></li>").
            join(''));

          }

          this.navItems.concat(this.nav).forEach((el) => el && (el.hidden = !this.maxIndex));

          this.updateNav();
        },

        events: ['resize'] },


      events: [
      {
        name: 'click',

        delegate() {
          return this.selNavItem;
        },

        handler(e) {
          e.preventDefault();
          this.show(uikitUtil.data(e.current, this.attrItem));
        } },


      {
        name: 'itemshow',
        handler: 'updateNav' }],



      methods: {
        updateNav() {
          const i = this.getValidIndex();
          for (const el of this.navItems) {
            const cmd = uikitUtil.data(el, this.attrItem);

            uikitUtil.toggleClass(el, this.clsActive, uikitUtil.toNumber(cmd) === i);
            uikitUtil.toggleClass(
            el,
            'uk-invisible',
            this.finite && (
            cmd === 'previous' && i === 0 || cmd === 'next' && i >= this.maxIndex));

          }
        } } };

    var Slider = {
      mixins: [SliderAutoplay, SliderDrag, SliderNav, Resize],

      props: {
        clsActivated: Boolean,
        easing: String,
        index: Number,
        finite: Boolean,
        velocity: Number,
        selSlides: String },


      data: () => ({
        easing: 'ease',
        finite: false,
        velocity: 1,
        index: 0,
        prevIndex: -1,
        stack: [],
        percent: 0,
        clsActive: 'uk-active',
        clsActivated: false,
        Transitioner: false,
        transitionOptions: {} }),


      connected() {
        this.prevIndex = -1;
        this.index = this.getValidIndex(this.$props.index);
        this.stack = [];
      },

      disconnected() {
        uikitUtil.removeClass(this.slides, this.clsActive);
      },

      computed: {
        duration(_ref, $el) {let { velocity } = _ref;
          return speedUp($el.offsetWidth / velocity);
        },

        list(_ref2, $el) {let { selList } = _ref2;
          return uikitUtil.$(selList, $el);
        },

        maxIndex() {
          return this.length - 1;
        },

        selSlides(_ref3) {let { selList, selSlides } = _ref3;
          return selList + " " + (selSlides || '> *');
        },

        slides: {
          get() {
            return uikitUtil.$$(this.selSlides, this.$el);
          },

          watch() {
            this.$emit('resize');
          } },


        length() {
          return this.slides.length;
        } },


      methods: {
        show(index, force) {if (force === void 0) {force = false;}
          if (this.dragging || !this.length) {
            return;
          }

          const { stack } = this;
          const queueIndex = force ? 0 : stack.length;
          const reset = () => {
            stack.splice(queueIndex, 1);

            if (stack.length) {
              this.show(stack.shift(), true);
            }
          };

          stack[force ? 'unshift' : 'push'](index);

          if (!force && stack.length > 1) {
            if (stack.length === 2) {
              this._transitioner.forward(Math.min(this.duration, 200));
            }

            return;
          }

          const prevIndex = this.getIndex(this.index);
          const prev = uikitUtil.hasClass(this.slides, this.clsActive) && this.slides[prevIndex];
          const nextIndex = this.getIndex(index, this.index);
          const next = this.slides[nextIndex];

          if (prev === next) {
            reset();
            return;
          }

          this.dir = getDirection(index, prevIndex);
          this.prevIndex = prevIndex;
          this.index = nextIndex;

          if (
          prev && !uikitUtil.trigger(prev, 'beforeitemhide', [this]) ||
          !uikitUtil.trigger(next, 'beforeitemshow', [this, prev]))
          {
            this.index = this.prevIndex;
            reset();
            return;
          }

          const promise = this._show(prev, next, force).then(() => {
            prev && uikitUtil.trigger(prev, 'itemhidden', [this]);
            uikitUtil.trigger(next, 'itemshown', [this]);

            return new Promise((resolve) => {
              requestAnimationFrame(() => {
                stack.shift();
                if (stack.length) {
                  this.show(stack.shift(), true);
                } else {
                  this._transitioner = null;
                }
                resolve();
              });
            });
          });

          prev && uikitUtil.trigger(prev, 'itemhide', [this]);
          uikitUtil.trigger(next, 'itemshow', [this]);

          return promise;
        },

        getIndex(index, prev) {if (index === void 0) {index = this.index;}if (prev === void 0) {prev = this.index;}
          return uikitUtil.clamp(uikitUtil.getIndex(index, this.slides, prev, this.finite), 0, this.maxIndex);
        },

        getValidIndex(index, prevIndex) {if (index === void 0) {index = this.index;}if (prevIndex === void 0) {prevIndex = this.prevIndex;}
          return this.getIndex(index, prevIndex);
        },

        _show(prev, next, force) {
          this._transitioner = this._getTransitioner(prev, next, this.dir, {
            easing: force ?
            next.offsetWidth < 600 ?
            'cubic-bezier(0.25, 0.46, 0.45, 0.94)' /* easeOutQuad */ :
            'cubic-bezier(0.165, 0.84, 0.44, 1)' /* easeOutQuart */ :
            this.easing,
            ...this.transitionOptions });


          if (!force && !prev) {
            this._translate(1);
            return Promise.resolve();
          }

          const { length } = this.stack;
          return this._transitioner[length > 1 ? 'forward' : 'show'](
          length > 1 ? Math.min(this.duration, 75 + 75 / (length - 1)) : this.duration,
          this.percent);

        },

        _getDistance(prev, next) {
          return this._getTransitioner(prev, prev !== next && next).getDistance();
        },

        _translate(percent, prev, next) {if (prev === void 0) {prev = this.prevIndex;}if (next === void 0) {next = this.index;}
          const transitioner = this._getTransitioner(prev !== next ? prev : false, next);
          transitioner.translate(percent);
          return transitioner;
        },

        _getTransitioner(
        prev,
        next,
        dir,
        options)
        {if (prev === void 0) {prev = this.prevIndex;}if (next === void 0) {next = this.index;}if (dir === void 0) {dir = this.dir || 1;}if (options === void 0) {options = this.transitionOptions;}
          return new this.Transitioner(
          uikitUtil.isNumber(prev) ? this.slides[prev] : prev,
          uikitUtil.isNumber(next) ? this.slides[next] : next,
          dir * (uikitUtil.isRtl ? -1 : 1),
          options);

        } } };



    function getDirection(index, prevIndex) {
      return index === 'next' ? 1 : index === 'previous' ? -1 : index < prevIndex ? -1 : 1;
    }

    function speedUp(x) {
      return 0.5 * x + 300; // parabola through (400,500; 600,600; 1800,1200)
    }

    var Slideshow = {
      mixins: [Slider],

      props: {
        animation: String },


      data: {
        animation: 'slide',
        clsActivated: 'uk-transition-active',
        Animations: Animations$1,
        Transitioner },


      computed: {
        animation(_ref) {let { animation, Animations } = _ref;
          return { ...(Animations[animation] || Animations.slide), name: animation };
        },

        transitionOptions() {
          return { animation: this.animation };
        } },


      events: {
        beforeitemshow(_ref2) {let { target } = _ref2;
          uikitUtil.addClass(target, this.clsActive);
        },

        itemshown(_ref3) {let { target } = _ref3;
          uikitUtil.addClass(target, this.clsActivated);
        },

        itemhidden(_ref4) {let { target } = _ref4;
          uikitUtil.removeClass(target, this.clsActive, this.clsActivated);
        } } };

    var Component = {
      mixins: [Container, Modal, Togglable, Slideshow],

      functional: true,

      props: {
        delayControls: Number,
        preload: Number,
        videoAutoplay: Boolean,
        template: String },


      data: () => ({
        preload: 1,
        videoAutoplay: false,
        delayControls: 3000,
        items: [],
        cls: 'uk-open',
        clsPage: 'uk-lightbox-page',
        selList: '.uk-lightbox-items',
        attrItem: 'uk-lightbox-item',
        selClose: '.uk-close-large',
        selCaption: '.uk-lightbox-caption',
        pauseOnHover: false,
        velocity: 2,
        Animations,
        template: "<div class=\"uk-lightbox uk-overflow-hidden\"> <ul class=\"uk-lightbox-items\"></ul> <div class=\"uk-lightbox-toolbar uk-position-top uk-text-right uk-transition-slide-top uk-transition-opaque\"> <button class=\"uk-lightbox-toolbar-icon uk-close-large\" type=\"button\" uk-close></button> </div> <a class=\"uk-lightbox-button uk-position-center-left uk-position-medium uk-transition-fade\" href uk-slidenav-previous uk-lightbox-item=\"previous\"></a> <a class=\"uk-lightbox-button uk-position-center-right uk-position-medium uk-transition-fade\" href uk-slidenav-next uk-lightbox-item=\"next\"></a> <div class=\"uk-lightbox-toolbar uk-lightbox-caption uk-position-bottom uk-text-center uk-transition-slide-bottom uk-transition-opaque\"></div> </div>" }),










      created() {
        const $el = uikitUtil.$(this.template);
        const list = uikitUtil.$(this.selList, $el);
        this.items.forEach(() => uikitUtil.append(list, '<li>'));

        this.$mount(uikitUtil.append(this.container, $el));
      },

      computed: {
        caption(_ref, $el) {let { selCaption } = _ref;
          return uikitUtil.$(selCaption, $el);
        } },


      events: [
      {
        name: uikitUtil.pointerMove + " " + uikitUtil.pointerDown + " keydown",

        handler: 'showControls' },


      {
        name: 'click',

        self: true,

        delegate() {
          return this.selSlides;
        },

        handler(e) {
          if (e.defaultPrevented) {
            return;
          }

          this.hide();
        } },


      {
        name: 'shown',

        self: true,

        handler() {
          this.showControls();
        } },


      {
        name: 'hide',

        self: true,

        handler() {
          this.hideControls();

          uikitUtil.removeClass(this.slides, this.clsActive);
          uikitUtil.Transition.stop(this.slides);
        } },


      {
        name: 'hidden',

        self: true,

        handler() {
          this.$destroy(true);
        } },


      {
        name: 'keyup',

        el() {
          return document;
        },

        handler(e) {
          if (!this.isToggled(this.$el) || !this.draggable) {
            return;
          }

          switch (e.keyCode) {
            case 37:
              this.show('previous');
              break;
            case 39:
              this.show('next');
              break;}

        } },


      {
        name: 'beforeitemshow',

        handler(e) {
          if (this.isToggled()) {
            return;
          }

          this.draggable = false;

          e.preventDefault();

          this.toggleElement(this.$el, true, false);

          this.animation = Animations['scale'];
          uikitUtil.removeClass(e.target, this.clsActive);
          this.stack.splice(1, 0, this.index);
        } },


      {
        name: 'itemshow',

        handler() {
          uikitUtil.html(this.caption, this.getItem().caption || '');

          for (let j = -this.preload; j <= this.preload; j++) {
            this.loadItem(this.index + j);
          }
        } },


      {
        name: 'itemshown',

        handler() {
          this.draggable = this.$props.draggable;
        } },


      {
        name: 'itemload',

        async handler(_, item) {
          const { source: src, type, alt = '', poster, attrs = {} } = item;

          this.setItem(item, '<span uk-spinner></span>');

          if (!src) {
            return;
          }

          let matches;
          const iframeAttrs = {
            allowfullscreen: '',
            style: 'max-width: 100%; box-sizing: border-box;',
            'uk-responsive': '',
            'uk-video': "" + this.videoAutoplay };


          // Image
          if (
          type === 'image' ||
          src.match(/\.(avif|jpe?g|jfif|a?png|gif|svg|webp)($|\?)/i))
          {
            try {
              const { width, height } = await uikitUtil.getImage(src, attrs.srcset, attrs.size);
              this.setItem(item, createEl('img', { src, width, height, alt, ...attrs }));
            } catch (e) {
              this.setError(item);
            }

            // Video
          } else if (type === 'video' || src.match(/\.(mp4|webm|ogv)($|\?)/i)) {
            const video = createEl('video', {
              src,
              poster,
              controls: '',
              playsinline: '',
              'uk-video': "" + this.videoAutoplay,
              ...attrs });


            uikitUtil.on(video, 'loadedmetadata', () => {
              uikitUtil.attr(video, { width: video.videoWidth, height: video.videoHeight });
              this.setItem(item, video);
            });
            uikitUtil.on(video, 'error', () => this.setError(item));

            // Iframe
          } else if (type === 'iframe' || src.match(/\.(html|php)($|\?)/i)) {
            this.setItem(
            item,
            createEl('iframe', {
              src,
              allowfullscreen: '',
              class: 'uk-lightbox-iframe',
              ...attrs }));



            // YouTube
          } else if (
          matches = src.match(
          /\/\/(?:.*?youtube(-nocookie)?\..*?[?&]v=|youtu\.be\/)([\w-]{11})[&?]?(.*)?/))

          {
            this.setItem(
            item,
            createEl('iframe', {
              src: "https://www.youtube" + (matches[1] || '') + ".com/embed/" + matches[2] + (
              matches[3] ? "?" + matches[3] : ''),

              width: 1920,
              height: 1080,
              ...iframeAttrs,
              ...attrs }));



            // Vimeo
          } else if (matches = src.match(/\/\/.*?vimeo\.[a-z]+\/(\d+)[&?]?(.*)?/)) {
            try {
              const { height, width } = await (
              await fetch("https://vimeo.com/api/oembed.json?maxwidth=1920&url=" +
              encodeURI(
              src),

              {
                credentials: 'omit' })).


              json();

              this.setItem(
              item,
              createEl('iframe', {
                src: "https://player.vimeo.com/video/" + matches[1] + (
                matches[2] ? "?" + matches[2] : ''),

                width,
                height,
                ...iframeAttrs,
                ...attrs }));


            } catch (e) {
              this.setError(item);
            }
          }
        } }],



      methods: {
        loadItem(index) {if (index === void 0) {index = this.index;}
          const item = this.getItem(index);

          if (!this.getSlide(item).childElementCount) {
            uikitUtil.trigger(this.$el, 'itemload', [item]);
          }
        },

        getItem(index) {if (index === void 0) {index = this.index;}
          return this.items[uikitUtil.getIndex(index, this.slides)];
        },

        setItem(item, content) {
          uikitUtil.trigger(this.$el, 'itemloaded', [this, uikitUtil.html(this.getSlide(item), content)]);
        },

        getSlide(item) {
          return this.slides[this.items.indexOf(item)];
        },

        setError(item) {
          this.setItem(item, '<span uk-icon="icon: bolt; ratio: 2"></span>');
        },

        showControls() {
          clearTimeout(this.controlsTimer);
          this.controlsTimer = setTimeout(this.hideControls, this.delayControls);

          uikitUtil.addClass(this.$el, 'uk-active', 'uk-transition-active');
        },

        hideControls() {
          uikitUtil.removeClass(this.$el, 'uk-active', 'uk-transition-active');
        } } };



    function createEl(tag, attrs) {
      const el = uikitUtil.fragment("<" + tag + ">");
      uikitUtil.attr(el, attrs);
      return el;
    }

    if (typeof window !== 'undefined' && window.UIkit) {
      window.UIkit.component('lightboxPanel', Component);
    }

    return Component;

}));
