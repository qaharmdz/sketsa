/*! UIkit 3.15.18 | https://www.getuikit.com | (c) 2014 - 2022 YOOtheme | MIT License */

(function (factory) {
    typeof define === 'function' && define.amd ? define('uikittest', factory) :
    factory();
})((function () { 'use strict';

    const hyphenateRe = /\B([A-Z])/g;

    const hyphenate = memoize((str) => str.replace(hyphenateRe, '-$1').toLowerCase());

    const ucfirst = memoize((str) =>
    str.length ? toUpper(null, str.charAt(0)) + str.slice(1) : '');


    function toUpper(_, c) {
      return c ? c.toUpperCase() : '';
    }

    function startsWith(str, search) {
      return str == null ? void 0 : str.startsWith == null ? void 0 : str.startsWith(search);
    }

    const { isArray, from: toArray } = Array;

    function isFunction(obj) {
      return typeof obj === 'function';
    }

    function isObject(obj) {
      return obj !== null && typeof obj === 'object';
    }

    function isWindow(obj) {
      return isObject(obj) && obj === obj.window;
    }

    function isDocument(obj) {
      return nodeType(obj) === 9;
    }

    function isNode(obj) {
      return nodeType(obj) >= 1;
    }

    function isElement(obj) {
      return nodeType(obj) === 1;
    }

    function nodeType(obj) {
      return !isWindow(obj) && isObject(obj) && obj.nodeType;
    }

    function isString(value) {
      return typeof value === 'string';
    }

    function isNumber(value) {
      return typeof value === 'number';
    }

    function isNumeric(value) {
      return isNumber(value) || isString(value) && !isNaN(value - parseFloat(value));
    }

    function isUndefined(value) {
      return value === void 0;
    }

    function toFloat(value) {
      return parseFloat(value) || 0;
    }

    function toNode(element) {
      return toNodes(element)[0];
    }

    function toNodes(element) {
      return element && (isNode(element) ? [element] : Array.from(element).filter(isNode)) || [];
    }

    function each(obj, cb) {
      for (const key in obj) {
        if (false === cb(obj[key], key)) {
          return false;
        }
      }
      return true;
    }

    function sumBy(array, iteratee) {
      return array.reduce(
      (sum, item) => sum + toFloat(isFunction(iteratee) ? iteratee(item) : item[iteratee]),
      0);

    }

    function memoize(fn) {
      const cache = Object.create(null);
      return (key) => cache[key] || (cache[key] = fn(key));
    }

    function attr(element, name, value) {
      if (isObject(name)) {
        for (const key in name) {
          attr(element, key, name[key]);
        }
        return;
      }

      if (isUndefined(value)) {var _toNode;
        return (_toNode = toNode(element)) == null ? void 0 : _toNode.getAttribute(name);
      } else {
        for (const el of toNodes(element)) {
          if (isFunction(value)) {
            value = value.call(el, attr(el, name));
          }

          if (value === null) {
            removeAttr(el, name);
          } else {
            el.setAttribute(name, value);
          }
        }
      }
    }

    function removeAttr(element, name) {
      const elements = toNodes(element);
      for (const attribute of name.split(' ')) {
        for (const element of elements) {
          element.removeAttribute(attribute);
        }
      }
    }

    function parent(element) {var _toNode;
      return (_toNode = toNode(element)) == null ? void 0 : _toNode.parentElement;
    }

    function filter(element, selector) {
      return toNodes(element).filter((element) => matches(element, selector));
    }

    function matches(element, selector) {
      return toNodes(element).some((element) => element.matches(selector));
    }

    function closest(element, selector) {
      return isElement(element) ?
      element.closest(startsWith(selector, '>') ? selector.slice(1) : selector) :
      toNodes(element).
      map((element) => closest(element, selector)).
      filter(Boolean);
    }

    function within(element, selector) {
      return isString(selector) ?
      !!closest(element, selector) :
      toNode(selector).contains(toNode(element));
    }

    function children(element, selector) {
      element = toNode(element);
      const children = element ? toNodes(element.children) : [];
      return selector ? filter(children, selector) : children;
    }

    function index(element, ref) {
      return ref ? toNodes(element).indexOf(toNode(ref)) : children(parent(element)).indexOf(element);
    }

    function find(selector, context) {
      return toNode(_query(selector, context, 'querySelector'));
    }

    function findAll(selector, context) {
      return toNodes(_query(selector, context, 'querySelectorAll'));
    }

    const contextSelectorRe = /(^|[^\\],)\s*[!>+~-]/;
    const isContextSelector = memoize((selector) => selector.match(contextSelectorRe));

    const contextSanitizeRe = /([!>+~-])(?=\s+[!>+~-]|\s*$)/g;
    const sanatize = memoize((selector) => selector.replace(contextSanitizeRe, '$1 *'));

    function _query(selector, context = document, queryFn) {
      if (!selector || !isString(selector)) {
        return selector;
      }

      selector = sanatize(selector);

      if (isContextSelector(selector)) {
        const split = splitSelector(selector);
        selector = '';
        for (let sel of split) {
          let ctx = context;

          if (sel[0] === '!') {
            const selectors = sel.substr(1).trim().split(' ');
            ctx = closest(parent(context), selectors[0]);
            sel = selectors.slice(1).join(' ').trim();
            if (!sel.length && split.length === 1) {
              return ctx;
            }
          }

          if (sel[0] === '-') {
            const selectors = sel.substr(1).trim().split(' ');
            const prev = (ctx || context).previousElementSibling;
            ctx = matches(prev, sel.substr(1)) ? prev : null;
            sel = selectors.slice(1).join(' ');
          }

          if (ctx) {
            selector += `${selector ? ',' : ''}${domPath(ctx)} ${sel}`;
          }
        }

        context = document;
      }

      try {
        return context[queryFn](selector);
      } catch (e) {
        return null;
      }
    }

    const selectorRe = /.*?[^\\](?:,|$)/g;

    const splitSelector = memoize((selector) =>
    selector.match(selectorRe).map((selector) => selector.replace(/,$/, '').trim()));


    function domPath(element) {
      const names = [];
      while (element.parentNode) {
        const id = attr(element, 'id');
        if (id) {
          names.unshift(`#${escape(id)}`);
          break;
        } else {
          let { tagName } = element;
          if (tagName !== 'HTML') {
            tagName += `:nth-child(${index(element) + 1})`;
          }
          names.unshift(tagName);
          element = element.parentNode;
        }
      }
      return names.join(' > ');
    }

    function escape(css) {
      return isString(css) ? CSS.escape(css) : '';
    }

    function on(...args) {
      let [targets, types, selector, listener, useCapture = false] = getArgs(args);

      if (listener.length > 1) {
        listener = detail(listener);
      }

      if (useCapture != null && useCapture.self) {
        listener = selfFilter(listener);
      }

      if (selector) {
        listener = delegate(selector, listener);
      }

      for (const type of types) {
        for (const target of targets) {
          target.addEventListener(type, listener, useCapture);
        }
      }

      return () => off(targets, types, listener, useCapture);
    }

    function off(...args) {
      let [targets, types,, listener, useCapture = false] = getArgs(args);
      for (const type of types) {
        for (const target of targets) {
          target.removeEventListener(type, listener, useCapture);
        }
      }
    }

    function getArgs(args) {
      // Event targets
      args[0] = toEventTargets(args[0]);

      // Event types
      if (isString(args[1])) {
        args[1] = args[1].split(' ');
      }

      // Delegate?
      if (isFunction(args[2])) {
        args.splice(2, 0, false);
      }

      return args;
    }

    function delegate(selector, listener) {
      return (e) => {
        const current =
        selector[0] === '>' ?
        findAll(selector, e.currentTarget).
        reverse().
        filter((element) => within(e.target, element))[0] :
        closest(e.target, selector);

        if (current) {
          e.current = current;
          listener.call(this, e);
        }
      };
    }

    function detail(listener) {
      return (e) => isArray(e.detail) ? listener(e, ...e.detail) : listener(e);
    }

    function selfFilter(listener) {
      return function (e) {
        if (e.target === e.currentTarget || e.target === e.current) {
          return listener.call(null, e);
        }
      };
    }

    function isEventTarget(target) {
      return target && 'addEventListener' in target;
    }

    function toEventTarget(target) {
      return isEventTarget(target) ? target : toNode(target);
    }

    function toEventTargets(target) {
      return isArray(target) ?
      target.map(toEventTarget).filter(Boolean) :
      isString(target) ?
      findAll(target) :
      isEventTarget(target) ?
      [target] :
      toNodes(target);
    }

    const cssNumber = {
      'animation-iteration-count': true,
      'column-count': true,
      'fill-opacity': true,
      'flex-grow': true,
      'flex-shrink': true,
      'font-weight': true,
      'line-height': true,
      opacity: true,
      order: true,
      orphans: true,
      'stroke-dasharray': true,
      'stroke-dashoffset': true,
      widows: true,
      'z-index': true,
      zoom: true
    };

    function css(element, property, value, priority = '') {
      const elements = toNodes(element);
      for (const element of elements) {
        if (isString(property)) {
          property = propName(property);

          if (isUndefined(value)) {
            return getComputedStyle(element).getPropertyValue(property);
          } else {
            element.style.setProperty(
            property,
            isNumeric(value) && !cssNumber[property] ?
            `${value}px` :
            value || isNumber(value) ?
            value :
            '',
            priority);

          }
        } else if (isArray(property)) {
          const props = {};
          for (const prop of property) {
            props[prop] = css(element, prop);
          }
          return props;
        } else if (isObject(property)) {
          priority = value;
          each(property, (value, property) => css(element, property, value, priority));
        }
      }
      return elements[0];
    }

    // https://drafts.csswg.org/cssom/#dom-cssstyledeclaration-setproperty
    const propName = memoize((name) => vendorPropName(name));

    function vendorPropName(name) {
      if (startsWith(name, '--')) {
        return name;
      }

      name = hyphenate(name);

      const { style } = document.documentElement;

      if (name in style) {
        return name;
      }

      for (const prefix of ['webkit', 'moz']) {
        const prefixedName = `-${prefix}-${name}`;
        if (prefixedName in style) {
          return prefixedName;
        }
      }
    }

    function addClass(element, ...args) {
      apply(element, args, 'add');
    }

    function removeClass(element, ...args) {
      apply(element, args, 'remove');
    }

    function apply(element, args, fn) {
      args = args.reduce((args, arg) => args.concat(getClasses(arg)), []);

      for (const node of toNodes(element)) {
        node.classList[fn](...args);
      }
    }

    function getClasses(str) {
      return String(str).split(/\s|,/).filter(Boolean);
    }

    const prepend = applyFn('prepend');

    function applyFn(fn) {
      return function (ref, element) {var _$;
        const nodes = toNodes(isString(element) ? fragment(element) : element);
        (_$ = $(ref)) == null ? void 0 : _$[fn](...nodes);
        return unwrapSingle(nodes);
      };
    }

    const fragmentRe = /^\s*<(\w+|!)[^>]*>/;
    const singleTagRe = /^<(\w+)\s*\/?>(?:<\/\1>)?$/;

    function fragment(html) {
      const matches = singleTagRe.exec(html);
      if (matches) {
        return document.createElement(matches[1]);
      }

      const container = document.createElement('div');
      if (fragmentRe.test(html)) {
        container.insertAdjacentHTML('beforeend', html.trim());
      } else {
        container.textContent = html;
      }

      return unwrapSingle(container.childNodes);
    }

    function unwrapSingle(nodes) {
      return nodes.length > 1 ? nodes : nodes[0];
    }

    function $(selector, context) {
      return isHtml(selector) ? toNode(fragment(selector)) : find(selector, context);
    }

    function isHtml(str) {
      return isString(str) && startsWith(str.trim(), '<');
    }

    const dirs = {
      width: ['left', 'right'],
      height: ['top', 'bottom']
    };

    dimension('height');
    dimension('width');

    function dimension(prop) {
      const propName = ucfirst(prop);
      return (element, value) => {
        if (isUndefined(value)) {
          if (isWindow(element)) {
            return element[`inner${propName}`];
          }

          if (isDocument(element)) {
            const doc = element.documentElement;
            return Math.max(doc[`offset${propName}`], doc[`scroll${propName}`]);
          }

          element = toNode(element);

          value = css(element, prop);
          value = value === 'auto' ? element[`offset${propName}`] : toFloat(value) || 0;

          return value - boxModelAdjust(element, prop);
        } else {
          return css(
          element,
          prop,
          !value && value !== 0 ? '' : +value + boxModelAdjust(element, prop) + 'px');

        }
      };
    }

    function boxModelAdjust(element, prop, sizing = 'border-box') {
      return css(element, 'boxSizing') === sizing ?
      sumBy(
      dirs[prop].map(ucfirst),
      (prop) => toFloat(css(element, `padding${prop}`)) +
      toFloat(css(element, `border${prop}Width`))) :

      0;
    }

    /* global ["accordion","alert","align","animation","article","background","badge","base","breadcrumb","button","card","close","column","comment","container","countdown","cover","description-list","divider","dotnav","drop","dropbar","dropdown","filter","flex","form","grid-masonry","grid-parallax","grid","heading","height-expand","height-viewport","height","icon","iconnav","image","label","leader","lightbox","link","list","margin","marker","modal","nav","navbar","notification","offcanvas","overlay","padding","pagination","parallax","placeholder","position","progress","scroll","scrollspy","search","section","slidenav","slider","slideshow","sortable","spinner","sticky-navbar","sticky-parallax","sticky","subnav","svg","switcher","tab","table","text","thumbnav","tile","toggle","tooltip","totop","transition","upload","utility","video","visibility","width"] */

    const tests = ["accordion", "alert", "align", "animation", "article", "background", "badge", "base", "breadcrumb", "button", "card", "close", "column", "comment", "container", "countdown", "cover", "description-list", "divider", "dotnav", "drop", "dropbar", "dropdown", "filter", "flex", "form", "grid-masonry", "grid-parallax", "grid", "heading", "height-expand", "height-viewport", "height", "icon", "iconnav", "image", "label", "leader", "lightbox", "link", "list", "margin", "marker", "modal", "nav", "navbar", "notification", "offcanvas", "overlay", "padding", "pagination", "parallax", "placeholder", "position", "progress", "scroll", "scrollspy", "search", "section", "slidenav", "slider", "slideshow", "sortable", "spinner", "sticky-navbar", "sticky-parallax", "sticky", "subnav", "svg", "switcher", "tab", "table", "text", "thumbnav", "tile", "toggle", "tooltip", "totop", "transition", "upload", "utility", "video", "visibility", "width"];
    const storage = window.sessionStorage;
    const key = '_uikit_style';
    const keyinverse = '_uikit_inverse';
    const docEl = document.documentElement;

    // try to load themes.json
    const request = new XMLHttpRequest();
    request.open('GET', '../themes.json', false);
    request.send(null);

    const themes = request.status === 200 ? JSON.parse(request.responseText) : {};
    const styles = {
      core: { css: '../dist/css/uikit-core.css' },
      theme: { css: '../dist/css/uikit.css' },
      ...themes
    };
    const component = location.pathname.
    split('/').
    pop().
    replace(/.html$/, '');

    const variations = {
      '': 'Default',
      light: 'Dark',
      dark: 'Light'
    };

    if (getParam('style') && getParam('style').match(/\.(json|css)$/)) {
      styles.custom = getParam('style');
    }

    storage[key] = storage[key] || 'core';
    storage[keyinverse] = storage[keyinverse] || '';

    const dir = storage._uikit_dir || 'ltr';

    // set dir
    docEl.dir = dir;

    const style = styles[storage[key]] || styles.theme;

    // add style
    document.writeln(
`<link rel="stylesheet" href="${
dir !== 'rtl' ? style.css : style.css.replace('.css', '-rtl.css')
}">`    );


    // add javascript
    document.writeln('<script src="../dist/js/uikit.js"></script>');
    document.writeln(
`<script src="${style.icons ? style.icons : '../dist/js/uikit-icons.js'}"></script>`    );


    on(window, 'load', () =>
    setTimeout(
    () =>
    requestAnimationFrame(() => {
      const $body = document.body;
      const $container = prepend(
      $body,
      ` <div class="uk-container"> <select class="uk-select uk-form-width-small" style="margin: 20px 20px 20px 0" aria-label="Component switcher"> <option value="index.html">Overview</option> ${tests.
  map(
  (name) => `<option value="${name}.html">${name.
  split('-').
  map(ucfirst).
  join(' ')}</option>`).

  join('')} </select> <select class="uk-select uk-form-width-small" style="margin: 20px" aria-label="Theme switcher"> ${Object.keys(styles).
  map((style) => `<option value="${style}">${ucfirst(style)}</option>`).
  join('')} </select> <select class="uk-select uk-form-width-small" style="margin: 20px" aria-label="Inverse switcher"> ${Object.keys(variations).
  map((name) => `<option value="${name}">${variations[name]}</option>`).
  join('')} </select> <label style="margin: 20px"> <input type="checkbox" class="uk-checkbox"/> <span style="margin: 5px">RTL</span> </label> </div> `);


      const [$tests, $styles, $inverse, $rtl] = $container.children;

      // Tests
      // ------------------------------

      on($tests, 'change', () => {
        if ($tests.value) {
          location.href = `${$tests.value}${
      styles.custom ? `?style=${getParam('style')}` : ''
      }`;
        }
      });
      $tests.value = `${component || 'index'}.html`;

      // Styles
      // ------------------------------

      on($styles, 'change', () => {
        storage[key] = $styles.value;
        location.reload();
      });
      $styles.value = storage[key];

      // Variations
      // ------------------------------

      $inverse.value = storage[keyinverse];

      if ($inverse.value) {
        removeClass(
        document.querySelectorAll('*'),
        'uk-navbar-container',
        'uk-card-default',
        'uk-card-muted',
        'uk-card-primary',
        'uk-card-secondary',
        'uk-tile-default',
        'uk-tile-muted',
        'uk-tile-primary',
        'uk-tile-secondary',
        'uk-section-default',
        'uk-section-muted',
        'uk-section-primary',
        'uk-section-secondary',
        'uk-overlay-default',
        'uk-overlay-primary');


        css(docEl, 'background', $inverse.value === 'dark' ? '#fff' : '#222');
        addClass($body, `uk-${$inverse.value}`);
      }

      on($inverse, 'change', () => {
        storage[keyinverse] = $inverse.value;
        location.reload();
      });

      // RTL
      // ------------------------------

      on($rtl, 'change', ({ target }) => {
        storage._uikit_dir = target.checked ? 'rtl' : 'ltr';
        location.reload();
      });
      $rtl.firstElementChild.checked = dir === 'rtl';

      css(docEl, 'paddingTop', '');
    }),
    100));



    css(docEl, 'paddingTop', '80px');

    function getParam(name) {
      const match = new RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
    }

}));
