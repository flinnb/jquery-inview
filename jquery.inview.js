// Copyright 2014, Sermo, Inc.
// Licensed with the MIT license
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

  // This is a helper, to enable us to work with nested containers that are scrollable
  // in a relatively easy way.
  function ScrollableContainer(element, rootElement, rootContainer) {
    this.element = element;
    this.rootElement = rootElement || element;
    this.rootContainer = rootContainer || this;
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
    elementInView: function () {
      var $element = $(this.rootElement);
      var relativeTop = $element.offset().top - $(window).scrollTop();
      var elementHeight = $element.height();
      var elementBottom = relativeTop + elementHeight;

      // If the element is not within the viewport of the window, there is
      // no point in checking the rest of the containers.
      if (this.elementInViewWindow(relativeTop, elementBottom)) {
        // If the container is the window, we're done here.
        if (this.$container[0] === window) {
          return true;
        } else {
          var elementInViewContainer = this.elementInViewContainer(relativeTop, elementBottom);

          if (this.parent) {
            return elementInViewContainer && this.parent.elementInView();
          } else {
            return elementInViewContainer;
          }
        }
      } else {
        return false;
      }
    },
    elementInViewWindow: function (relativeTop, elementBottom) {
      return elementBottom <= $(window).height() && relativeTop >= 0;
    },
    elementInViewContainer: function (relativeTop, elementBottom) {
      var containerTop = this.$container.offset().top - $(window).scrollTop();
      var containerHeight = this.$container.height();
      var borderOffset = this.$container.outerHeight() - this.$container.height();
      var containerBottom = containerTop + containerHeight + borderOffset;
      return elementBottom <= containerBottom && relativeTop >= containerTop;
    },
    addScrollListener: function () {
      var self = this;
      this.$container.on("scroll", function () {
        if (self.rootContainer.elementInView()) {
          self.triggerInView();
        }
      });
      if (this.parent) {
        this.parent.addScrollListener();
      }
    },
    triggerInView: function () {
      $(this.rootElement).trigger("inView");
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
      if (!$.data(document, "scrollableContainers")) {
        $.data(document, "scrollableContainers", []);
      }
      var containers = $.data(document, "scrollableContainers");
      containers.push(container);
      $.data(document, "scrollableContainers", containers);
    }
  };

  $.elementInView = {};

  $.elementInView.forceCheck = function () {
    var containers = $.data(document, "scrollableContainers") || [];

    for (var i = 0; i < containers.length; i++) {
      if (containers[i].elementInView()) {
        containers[i].triggerInView();
      }
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
