// Copyright 2014, Barry Flinn
// Licensed with the MIT license
// https://bitbucket.org/flinnb/jquery-inview/raw/e6f151762d769a26c5eaf22406271aba5614f0bb/LICENSE

(function ($, window, document, undefined) {

  // This is a custom filter, used to find an element which is set up to be
  // scrollable.  It currently only cares about vertical scrolling, which
  // is why "overflow-x" is not accounted for here.
  $.extend($.expr[':'], {
    scrollable: function (element) {
      var $elem = $(element);
      if ($elem.css("overflow") || $elem.css("overflow-y")) {
        var overflowStyle = $elem.css("overflow") || $elem.css("overflow-y");
        if (overflowStyle === "scroll" || overflowStyle === "auto") {
          var scrollHeight = $elem.prop("scrollHeight");
          var displayHeight = $elem.height();
          return scrollHeight > displayHeight;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  });

  function ScrollableContainer(element, rootElement, rootContainer, child) {
    this.element = element;
    this.rootElement = rootElement || element;
    this.rootContainer = rootContainer || this;
    this.child = child;
    this.init();
  }

  ScrollableContainer.prototype = {
    init: function () {
      var $parents = $(this.element).parents(":scrollable");
      if ($parents.length === 0) {
        this.$container = $(window);
      } else {
        this.$container = $($parents[0]);
        this.parent = new ScrollableContainer(this.$container[0], this.element, this.rootContainer, this);
      }
      return this;
    },
    inView: function () {
      var $element = $(this.rootElement);
      var relativeTop = $element.offset().top - $(window).scrollTop();
      var elementHeight = $element.height();

      if (this.inViewWindow(relativeTop, elementHeight)) {
        if (this.$container[0] === window) {
          return true;
        } else {
          var inViewContainer = this.inViewContainer(relativeTop, elementHeight);

          if (this.parent) {
            return inViewContainer && this.parent.inView();
          } else {
            return inViewContainer;
          }
        }
      } else {
        return false;
      }
    },
    inViewWindow: function (relativeTop, elementHeight) {
      return (relativeTop + elementHeight) <= $(window).height();
    },
    inViewContainer: function (relativeTop, elementHeight) {
      var containerTop = this.$container.offset().top - $(window).scrollTop();
      var containerHeight = this.$container.height();
      return (relativeTop + elementHeight) <= (containerTop + containerHeight);
    },
    addScrollListener: function () {
      var self = this;
      this.$container.on("scroll", function () {
        if (self.rootContainer.inView()) {
          $(self.rootElement).trigger("inView");
        }
      });
      if (this.parent) {
        this.parent.addScrollListener();
      }
    }
  };

  var pluginName = "elementInView";

  function ElementInView(element) {
    this.element = element;
    this._name = pluginName;
    this.init();
  }

  ElementInView.prototype = {
    init: function () {
      var container = new ScrollableContainer(this.element);
      container.addScrollListener();
      console.debug(container);
    }
  };

  $.fn[pluginName] = function () {
    this.each(function() {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new ElementInView(this));
      }
    });
    return this;
  };

})(jQuery, window, document);
