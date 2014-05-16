describe("ElementInView", function () {
  it("should be chainable", function () {
    $("body").append("<div id='simple-test-element'>Simple Test</div>");
    var $element = $("#simple-test-element");
    $element.elementInView().addClass("test-class");
    expect($element.hasClass("test-class")).toBeTruthy();
    $element.remove();
  });

  it("should trigger 'inView' event when element is scrolled into view in container", function () {
    $("body").append(
      "<section id='block' style='overflow: auto; height: 200px; border: solid 1px red;'>" +
      "  <p>I am a paragraph...</p>" +
      "  <p>I am a paragraph...</p>" +
      "  <p>I am a paragraph...</p>" +
      "  <p>I am a paragraph...</p>" +
      "  <p>I am a paragraph...</p>" +
      "  <p>I am a paragraph...</p>" +
      "  <p id='paragraph'>I am the test paragraph...</p>" +
      "  <p>I am a paragraph...</p>" +
      "  <p>I am a paragraph...</p>" +
      "  <p>I am a paragraph...</p>" +
      "</section>"
    );
    var inView = false;
    var $element = $("#paragraph");
    $element.elementInView().on("inView", function () {
      inView = true;
    });
    var $container = $("#block");
    $container.scrollTop(100);
    $container.scroll();
    expect(inView).toBe(true);
    $container.remove();
  });

  it("should trigger 'inView' event when element is scrolled into view in window", function () {
    $("body").append("<p id='paragraph'>I am a test paragraph...</p>");
    var inView = false;
    var $element = $("#paragraph");
    $element.elementInView().on("inView", function () {
      inView = true;
    });
    $(window).scroll();
    expect(inView).toBe(true);
    $element.remove();
  });

  it("should trigger 'inView' event when 'forceCheck()' is called and the element is viewable", function () {
    $("body").append("<p id='paragraph'>I am a test paragraph...</p>");
    var inView = false;
    var $element = $("#paragraph");
    $element.elementInView().on("inView", function () {
      inView = true;
    });
    $.elementInView.forceCheck();
    expect(inView).toBe(true);
    $element.remove();
  });

  it("shoud NOT trigger an 'inView' event when the element is only scrolled into view in one of its nested containers" , function () {
    $("body").append(
      "<section id='block-a' style='overflow: auto; height: 200px; border: solid 1px red;'>" +
      "  <section id='block-b' style='overflow: auto; height: 150px; width: 75%; border: solid 1px blue; position: relative; top: 100px;'>" +
      "    <p id='paragraph' style='position: relative; top: 300px; height: 20px;'>I am the test paragraph...</p>" +
      "  </section>" +
      "</section>" +
      "<section id='demo-label-3'></section>"
    );
    var inView = false;
    var $element = $("#paragraph");
    $element.elementInView().on("inView", function () {
      inView = true;
    });
    var $blockB = $("#block-b");
    $blockB.scrollTop(300);
    $blockB.scroll();
    expect(inView).toBe(false);
    $("#block-a").remove();
  });

  it("shoud trigger an 'inView' event when the element is scrolled into view in ALL of its nested containers" , function () {
    $("body").append(
      "<section id='block-a' style='overflow: auto; height: 200px; border: solid 1px red;'>" +
      "  <section id='block-b' style='overflow: auto; height: 150px; width: 75%; border: solid 1px blue; position: relative; top: 100px;'>" +
      "    <p id='paragraph' style='position: relative; top: 300px; height: 20px;'>I am the test paragraph...</p>" +
      "  </section>" +
      "</section>" +
      "<section id='demo-label-3'></section>"
    );
    var inView = false;
    var $element = $("#paragraph");
    $element.elementInView().on("inView", function () {
      inView = true;
    });
    var $blockA = $("#block-a");
    $blockA.scrollTop(200);
    $blockA.scroll();
    var $blockB = $("#block-b");
    $blockB.scrollTop(300);
    $blockB.scroll();
    expect(inView).toBe(true);
    $blockA.remove();
  });

  it("should not error when there are no scrollableContainers available", function () {
    $.removeData(document, "scrollableContainers");
    result = $.elementInView.forceCheck();
    expect(result).toBeUndefined();
  });
});
