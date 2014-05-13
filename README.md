jquery-inview
=============

This is a jQuery plugin, used to determine whether or not a given element
is actually viewable by the user.  It will take into account whether the
element is also nested within one or more "scrollable" containers, and
verify that it is visible in them as well. When the element is scrolled
into view, a custom `inView` event will be triggered, which you can listen
for.

Basic Usage
-----------

Given a document with the following html:

```html
<section id="block" style="overflow: auto; height: 200px; border: solid 1px red;">
  <p id="paragraph" style="position: relative; top: 300px; height: 20px;">I am the test paragraph...</p>
</section>
```

you can attach the plugin to the paragraph like so:

```javascript
$("#paragraph").elementInView();
```

Behind the scenes, this adds a listener to the scroll event of both the window,
and the element `#block`.  When the window or the `#block` element are scrolled,
the plugin checks to see if the `#paragraph` is viewable within the box of the
`#block`, *AND* within the window.  If it is within both boxes, the `#paragraph`
element will trigger the `inView` event.

If you want to do something when the element scrolls into view, you can do:

```javascript
$("#paragraph").elementInView().on("inView", function () {
    doSomethingAwesome(this);
});
```

This comes in handy when you need to do something with an element, but only
when it is visible to the end user.

There is also an extra method added to the plugin, which allows you to "force"
the check of all of the items with the plugin applied, and see if they are
visible.  This lets you trigger the `inView` event on all of the elements that
are currently visible, without having to wait for the `scroll` event(s) to fire.

Example:

```javascript
$.elementInView.forceCheck();
```

This is a useful method to use on page load, to track items that are loaded
and already within the viewable area(s).
