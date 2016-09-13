/**
 * qing-gallery v0.0.1
 * http://mycolorway.github.io/qing-gallery
 *
 * Copyright Mycolorway Design
 * Released under the MIT license
 * http://mycolorway.github.io/qing-gallery/license.html
 *
 * Date: 2016-09-13
 */
;(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory(require('jquery'),require('qing-module'));
  } else {
    root.QingGallery = factory(root.jQuery,root.QingModule);
  }
}(this, function ($,QingModule) {
var define, module, exports;
var b = require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var ImageItem,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ImageItem = (function(superClass) {
  extend(ImageItem, superClass);

  function ImageItem(opts) {
    this.el = $(opts.el);
    this.thumb = {
      src: this.el.attr('src'),
      size: {
        width: this.el.width(),
        height: this.el.height()
      }
    };
    this.origin = {
      src: this.el.data('origin-src'),
      size: this._getOriginSize(),
      download: this.el.data('download-src'),
      name: this.el.data('origin-name') || this.el.attr('alt') || ''
    };
    this.el.data('imageItem', this);
  }

  ImageItem.prototype._getOriginSize = function() {
    var size;
    size = this.el.data('origin-size');
    size = size ? size.split(',') : [0, 0];
    return {
      width: size[0] * 1 || this.thumb.size.width * 10,
      height: size[1] * 1 || this.thumb.size.height * 10
    };
  };

  return ImageItem;

})(QingModule);

module.exports = ImageItem;

},{}],2:[function(require,module,exports){
var Control,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Control = (function(superClass) {
  extend(Control, superClass);

  Control._tpl = '<a class="control" href="javascript:;">\n  <span class="name"></span>\n</a>';

  function Control(qingGallery) {
    this.qingGallery = qingGallery;
    this.el = $(Control._tpl).addClass("control-" + this.name).find('.name').text(qingGallery.opts.locales[this.name]).end().attr('title', 'Rotate').appendTo(qingGallery.preview.controls.find('.controls'));
    this._bind();
  }

  Control.prototype._bind = function() {
    return 'need to implement';
  };

  return Control;

})(QingModule);

module.exports = Control;

},{}],3:[function(require,module,exports){
var Control, Download,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Control = require('./control.coffee');

Download = (function(superClass) {
  extend(Download, superClass);

  Download.prototype.name = 'download';

  function Download(qingGallery) {
    Download.__super__.constructor.apply(this, arguments);
    this.el.attr('target', '_blank');
  }

  Download.prototype.load = function(imageItem) {
    if (imageItem.origin.download) {
      return this.el.show().attr('href', imageItem.origin.download);
    } else {
      return this.el.hide();
    }
  };

  return Download;

})(Control);

module.exports = Download;

},{"./control.coffee":2}],4:[function(require,module,exports){
var Control, Rotate, utils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Control = require('./control.coffee');

utils = require('../utils.coffee');

Rotate = (function(superClass) {
  extend(Rotate, superClass);

  Rotate.prototype.name = 'rotate';

  function Rotate(qingGallery) {
    Rotate.__super__.constructor.apply(this, arguments);
    this.degree = 0;
  }

  Rotate.prototype._bind = function() {
    return this.el.on('click', (function(_this) {
      return function() {
        return _this.rotateTo(_this.degree + 90);
      };
    })(this));
  };

  Rotate.prototype.reset = function() {
    if (!this.qingGallery.preview.imageItem) {
      return;
    }
    return this.rotateTo(this.degree - this.degree % 360);
  };

  Rotate.prototype.rotateTo = function(degree) {
    this.degree = degree;
    return this.qingGallery.preview.frame.css(this._rotateFitSize()).css({
      transform: "rotate(" + this.degree + "deg)"
    });
  };

  Rotate.prototype._rotateFitSize = function() {
    var isOrthogonal, originSize, size;
    isOrthogonal = this.degree / 90 % 2 === 1;
    originSize = this.qingGallery.preview.imageItem.origin.size;
    if (isOrthogonal) {
      originSize = {
        width: originSize.height,
        height: originSize.width
      };
    }
    size = utils.fitSize({
      width: this.qingGallery.preview.stage.width(),
      height: this.qingGallery.preview.stage.height()
    }, originSize);
    if (isOrthogonal) {
      size = {
        width: size.height,
        height: size.width
      };
    }
    return size;
  };

  return Rotate;

})(Control);

module.exports = Rotate;

},{"../utils.coffee":6,"./control.coffee":2}],5:[function(require,module,exports){
var Control, Source,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Control = require('./control.coffee');

Source = (function(superClass) {
  extend(Source, superClass);

  Source.prototype.name = 'source';

  function Source(qingGallery) {
    Source.__super__.constructor.apply(this, arguments);
    this.el.attr('target', '_blank');
  }

  Source.prototype.load = function(imageItem) {
    return this.el.attr('href', imageItem.origin.src);
  };

  return Source;

})(Control);

module.exports = Source;

},{"./control.coffee":2}],6:[function(require,module,exports){
var Utils;

Utils = {
  preloadImages: function(images, callback) {
    var base, i, img, len, loadedImages, results, url;
    (base = arguments.callee).loadedImages || (base.loadedImages = {});
    loadedImages = arguments.callee.loadedImages;
    if (Object.prototype.toString.call(images) === "[object String]") {
      images = [images];
    } else if (Object.prototype.toString.call(images) !== "[object Array]") {
      return false;
    }
    images = $.unique(images);
    results = [];
    for (i = 0, len = images.length; i < len; i++) {
      url = images[i];
      if (!loadedImages[url] || callback) {
        img = new Image();
        if ($.isFunction(callback)) {
          img.onload = function() {
            loadedImages[url] = true;
            return callback(img);
          };
          img.onerror = function() {
            return callback();
          };
        }
        results.push(img.src = url);
      } else {
        results.push(void 0);
      }
    }
    return results;
  },
  transitionEnd: function() {
    var el, t, transitions;
    el = document.createElement('fakeelement');
    transitions = {
      'transition': 'transitionend',
      'MozTransition': 'transitionend',
      'WebkitTransition': 'webkitTransitionEnd'
    };
    for (t in transitions) {
      if (el.style[t] !== void 0) {
        return transitions[t];
      }
    }
  },
  fitSize: function(container, inner) {
    if (inner.width <= container.width && inner.height <= container.height) {
      return inner;
    }
    if (inner.width / inner.height > container.width / container.height) {
      return {
        width: container.width,
        height: container.width * inner.height / inner.width
      };
    }
    return {
      height: container.height,
      width: container.height * inner.width / inner.height
    };
  }
};

module.exports = Utils;

},{}],7:[function(require,module,exports){
var List, utils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

utils = require('../utils.coffee');

List = (function(superClass) {
  extend(List, superClass);

  List.opts = {
    imageItems: null,
    selected: null
  };

  List._tpl = '<div class="qing-gallery-list"></div>';

  List._imageItem = '<a class="thumb" href="javascript:;"><img src="" /></a>';

  function List(opts) {
    List.__super__.constructor.apply(this, arguments);
    this.opts = $.extend({}, List.opts, opts);
    this._render();
    this._bind();
    if (this.opts.imageItems.length <= 1) {
      this.el.hide();
    }
  }

  List.prototype._bind = function() {
    return this.el.on('click.qing-gallery', '.thumb', (function(_this) {
      return function(e) {
        var $imageItem, imageItem;
        $imageItem = $(e.currentTarget);
        imageItem = $imageItem.data('imageItem');
        $imageItem.addClass('selected').siblings('.selected').removeClass('selected');
        _this._scrollToSelected();
        _this.trigger('imageItemChange', [imageItem]);
        return false;
      };
    })(this));
  };

  List.prototype._render = function() {
    this.el = $(List._tpl);
    this.el.append(this.opts.imageItems.map((function(_this) {
      return function(imageItem) {
        var $imageItem;
        $imageItem = $(List._imageItem).find('img').attr('src', imageItem.thumb.src).end().data('imageItem', imageItem);
        if (imageItem === _this.opts.selected) {
          $imageItem.addClass('selected');
        }
        return $imageItem;
      };
    })(this)));
    return utils.preloadImages(this.opts.imageItems.map(function(imageItem) {
      return imageItem.origin.src;
    }));
  };

  List.prototype.prev = function() {
    var $prev;
    $prev = this.el.find('.selected').prev();
    if (!$prev.length) {
      $prev = this.el.find('.thumb:last');
    }
    return $prev.click();
  };

  List.prototype.next = function() {
    var $next;
    $next = this.el.find('.selected').next();
    if (!$next.length) {
      $next = this.el.find('.thumb:first');
    }
    return $next.click();
  };

  List.prototype._scrollToSelected = function() {
    var $selected, docScrollTop, offset;
    $selected = this.el.find('.selected');
    offset = $selected.offset();
    docScrollTop = $(document).scrollTop();
    if (offset.top <= docScrollTop + $(window).height() - $selected.outerHeight() && offset.top >= docScrollTop) {
      return;
    }
    return this.el.scrollTop(this.el.scrollTop() + offset.top - docScrollTop - parseInt($selected.css('marginTop')));
  };

  List.prototype.destroy = function() {
    return this.el.fadeOut('50');
  };

  return List;

})(QingModule);

module.exports = List;

},{"../utils.coffee":6}],8:[function(require,module,exports){
var Preview, utils,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

utils = require('../utils.coffee');

Preview = (function(superClass) {
  extend(Preview, superClass);

  Preview._tpl = "<div class=\"qing-gallery-preview\">\n  <div class=\"qing-gallery-stage loading\">\n    <div class=\"frame\">\n      <img src=\"\" />\n      <div class=\"loading-indicator\"></div>\n    </div>\n  </div>\n  <div class=\"qing-gallery-controls\">\n    <span class=\"filename\"></span>\n    <div class=\"controls\"></div>\n  </div>\n</div>";

  function Preview(opts) {
    this.el = $(Preview._tpl);
    this._render();
    this._bind();
  }

  Preview.prototype._render = function() {
    this.controls = this.el.find('.qing-gallery-controls');
    this.stage = this.el.find('.qing-gallery-stage');
    this.frame = this.stage.find('.frame');
    return this.img = this.stage.find('img');
  };

  Preview.prototype._bind = function() {
    return this.stage.on('click.qing-gallery', (function(_this) {
      return function(e) {
        if ($(e.target).is($(e.currentTarget))) {
          return _this.trigger('modalClick');
        }
      };
    })(this));
  };

  Preview.prototype.init = function(imageItem) {
    this.frame.css(this._frameInitialPos(imageItem)).css(imageItem.thumb.size);
    return this.img.attr('src', imageItem.thumb.src);
  };

  Preview.prototype.load = function(imageItem) {
    this.frame.addClass('animate').css({
      left: 0,
      top: 0
    }).css(utils.fitSize({
      width: this.stage.width(),
      height: this.stage.height()
    }, imageItem.origin.size));
    this.img.attr('src', imageItem.thumb.src);
    this.stage.addClass('modal');
    this.el.find('.filename').text(imageItem.origin.name);
    this.frame.addClass('loading');
    utils.preloadImages(imageItem.origin.src, (function(_this) {
      return function(originImage) {
        if (!originImage || !originImage.src) {
          return;
        }
        _this.img.attr('src', originImage.src);
        return _this.frame.removeClass('loading');
      };
    })(this));
    return this.imageItem = imageItem;
  };

  Preview.prototype._frameInitialPos = function(imageItem) {
    var $doc, offset;
    $doc = $(document);
    offset = imageItem.el.offset();
    return {
      top: (offset.top - $doc.scrollTop() - (this.stage.outerHeight() - imageItem.el.height()) / 2) * 2,
      left: (offset.left - $doc.scrollLeft() - (this.stage.outerWidth() - imageItem.el.width()) / 2) * 2
    };
  };

  Preview.prototype.destroy = function(callback) {
    this.controls.fadeOut('50');
    this.stage.removeClass('modal');
    this.frame.css(this.imageItem.thumb.size).css(this._frameInitialPos(this.imageItem));
    return this.frame.one(utils.transitionEnd(), function(e) {
      return callback();
    });
  };

  return Preview;

})(QingModule);

module.exports = Preview;

},{"../utils.coffee":6}],"qing-gallery":[function(require,module,exports){
var Download, ImageItem, List, Preview, QingGallery, Rotate, Source,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Preview = require('./views/preview.coffee');

List = require('./views/list.coffee');

ImageItem = require('./models/image-item.coffee');

Rotate = require('./plugins/rotate.coffee');

Download = require('./plugins/download.coffee');

Source = require('./plugins/source.coffee');

QingGallery = (function(superClass) {
  extend(QingGallery, superClass);

  QingGallery.opts = {
    el: null,
    scopeSelector: '',
    matchSelector: '',
    plugins: ['rotate', 'download', 'source'],
    locales: {
      rotate: 'Rotate',
      download: 'Download',
      source: 'Source'
    }
  };

  function QingGallery(opts) {
    this.opts = $.extend({}, QingGallery.opts, opts);
    this.el = $(this.opts.el);
    if (!(this.el.length > 0)) {
      throw new Error('QingGallery: option el is required');
    }
    QingGallery.destroyAll();
    this._render();
    this._bind();
    QingGallery.__super__.constructor.call(this, this.opts);
    this.preview.init(this.el.data('imageItem'));
    this.list.el.find('.selected').click();
  }

  QingGallery.prototype._render = function() {
    this.imageItems = this.el.closest(this.opts.scopeSelector).find(this.opts.matchSelector).add(this.el).map(function() {
      return new ImageItem({
        el: this
      });
    }).get();
    this.preview = new Preview();
    this.list = new List({
      imageItems: this.imageItems,
      selected: this.el.data('imageItem')
    });
    this.wrapper = $('<div class="qing-gallery"></div>').data('qingGallery', this).append([this.preview.el, this.list.el]).appendTo('body');
    $('html').addClass('qing-gallery-active');
    return this.el.data('qingGallery', this);
  };

  QingGallery.prototype._bind = function() {
    this.list.on('imageItemChange', (function(_this) {
      return function(e, imageItem) {
        _this.plugins.rotate.reset();
        _this.plugins.download.load(imageItem);
        _this.plugins.source.load(imageItem);
        return _this.preview.load(imageItem);
      };
    })(this));
    this.preview.on('modalClick', (function(_this) {
      return function() {
        return _this.destroy();
      };
    })(this));
    return $(document).on('keydown.qing-gallery', (function(_this) {
      return function(e) {
        if (/27|32/.test(e.which)) {
          _this.destroy();
          return false;
        } else if (/37|38/.test(e.which)) {
          _this.list.prev();
          return false;
        } else if (/39|40/.test(e.which)) {
          _this.list.next();
          return false;
        }
      };
    })(this));
  };

  QingGallery.prototype.destroy = function() {
    this.plugins.rotate.reset();
    this.list.off('imageItemChange');
    this.preview.off('modalClick');
    $(document).off('.qing-gallery');
    this.list.destroy();
    return this.preview.destroy((function(_this) {
      return function() {
        _this.wrapper.remove();
        _this.el.removeData('qingGallery');
        return $('html').removeClass('qing-gallery-active');
      };
    })(this));
  };

  QingGallery.destroyAll = function() {
    return $('.qing-gallery').each(function() {
      var ref;
      return (ref = $(this).data('qingGallery')) != null ? ref.destroy() : void 0;
    });
  };

  return QingGallery;

})(QingModule);

QingGallery.plugin('rotate', Rotate);

QingGallery.plugin('download', Download);

QingGallery.plugin('source', Source);

module.exports = QingGallery;

},{"./models/image-item.coffee":1,"./plugins/download.coffee":3,"./plugins/rotate.coffee":4,"./plugins/source.coffee":5,"./views/list.coffee":7,"./views/preview.coffee":8}]},{},[]);

return b('qing-gallery');
}));
