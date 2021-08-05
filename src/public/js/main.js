/* =============================================================================================
* Table of Contents:
*
* 1.0 - Load Custom, Google Fonts
* 2.0 - Simple Fixes
* 3.0 - Initialize Custom scrollbar (only on Desktops)
* 4.0 - Initialize PhotoSwipe Gallery
* 5.0 - Initialize Countdown
* 6.0 - Set Teaser FPS (Optional)
* 7.0 - Initialize Sven Teaser Plugin
* 8.0 - Page Reveal Animation
* 9.0 - Teaser Controls (Play / Pause / Restart/ Mute / Skip)
* 10.0 - Subscription / Contact Form
============================================================================================= */
"use strict";

/* ==================================================================
	Global Variables
================================================================== */
window.lazySizesConfig = window.lazySizesConfig || {};
lazySizesConfig.preloadAfterLoad = 1; // load all images after the window onload event
var isFontActive = false, // to check if Main Font is loaded before the teaser initiates
  isFirefox = typeof InstallTrigger !== "undefined",
  isIE = /*@cc_on!@*/ false || !!document.documentMode,
  isEdge = !isIE && !!window.StyleMedia,
  isChrome = !!window.chrome && !!window.chrome.webstore;

/* Color variables for Animations */
var primaryBG = "transparent",
  primaryTinge = "#FFF",
  secondaryBG = "#FFF",
  secondaryTinge = "#000", // used in scenes 14,33
  tinge1 = "#4A4A4A", // used in scenes 21,23,29,31
  tinge2 = "#666", // used in scenes 1,11
  tinge3 = "#808080"; // used in scene 37

$(function () {
  /* ==================================================================
	1.0 Load Custom, Google Fonts
	================================================================== */
  WebFont.load({
    custom: {
      families: ["TeXGyreHeros"],
    },
    google: {
      families: ["Poppins:300,400,500,600"],
    },
    classes: false,
    timeout: 5000,
    fontactive: function (familyName, fvd) {
      if (familyName == "TeXGyreHeros") {
        document.documentElement.className += " fontLoaded";
        isFontActive = true;
        $(document).trigger("fontActive");
      }
    },
    fontinactive: function (familyName, fvd) {
      if (familyName == "TeXGyreHeros") {
        isFontActive = true;
        $(document).trigger("fontActive");
      }
    },
  });

  // add class "highlight" to sound button
  $(".pl-sound").parent().addClass("highlight");

  /* ==================================================================
	2.0 Simple Fixes
	================================================================== */

  /* Preloader Animation Fallback for ie9 */
  if (navigator.userAgent.indexOf("MSIE") != -1)
    var detectIEregexp = /MSIE (\d+\.\d+);/;
  //test for MSIE x.x
  // if no "MSIE" string in userAgent
  else var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/; //test for rv:x.x or rv x.x where Trident string exists
  if (detectIEregexp.test(navigator.userAgent)) {
    //if some form of IE
    var ieversion = new Number(RegExp.$1); // capture x.x portion and store as a number
    if (ieversion <= 9) {
      $("body").addClass("loader-ie9");
    }
  }

  /* Set Minimum Height of the Content Container */
  var winH = $(window).height();
  $(".side-right").css("min-height", winH + "px");

  /* Set image container height to fit Vertical Rhythm */
  function setImageBase() {
    var baseLine = parseInt($(".vflow").css(".line-height"));
    var baseHeight = baseLine * 7;
    $(".ps-link").each(function (index, element) {
      var link = $(this);
      if (index == 0) {
        var resWidth = link.width();
        var origDim = link.attr("data-size").split("x");
        baseHeight = ((origDim[1] / origDim[0]) * resWidth).roundTo(30);
      }
      link.css("height", baseHeight + "px");
    });
  }
  setImageBase();
  objectFitImages("img.ofit");

  /* ScrollTo Animation Fix */
  $(document).on("click", "a[href^='#']", function (e) {
    var href = $(this).attr("href"),
      target = $(href).parents(".mCustomScrollbar");
    if (target.length) {
      e.preventDefault();
      target.mCustomScrollbar("scrollTo", href);
    } else {
      target = $(this.hash);
      target = target.length ? target : $("[name=" + this.hash.substr(1) + "]");
      if (target.length) {
        $("#main-wrapper").animate(
          {
            scrollTop: target.offset().top,
          },
          1000
        );
        return false;
      }
    }
  });

  /* Click "More Information" button to open split */
  $("#mi-btn, #close-info").on("click", function (e) {
    $("#main-wrapper").toggleClass("split-active");
  });

  /* Window resize functions */
  $(window).on("debouncedresize", function () {
    winH = $(window).height();
    $(".side-right").css("min-height", winH + "px");
    setImageBase();
  });

  /* ==================================================================
	3.0 Initialize Custom scrollbar (only on Desktops)
	================================================================== */
  if (!isMobile.any) {
    $("#main-wrapper").mCustomScrollbar({
      scrollInertia: 150,
      axis: "y",
    });
  } else {
    document.documentElement.className += " scroll-touch";
  }

  /* ==================================================================
	4.0 Initialize PhotoSwipe Gallery
	================================================================== */
  initPhotoSwipeFromDOM(".st-gallery");

  /* ==================================================================
	5.0 Initialize Countdown
	TTBD : Revert to previous version as in Sven
	================================================================== */
  if ($(".st-countdown").length) {
    var launchDate = $(".st-countdown").attr("data-launch-date")
      ? $(".st-countdown").attr("data-launch-date")
      : new Date(1630436399000 + 24 * 30 * 60 * 60 * 1000);
    $(".st-countdown").countdown(launchDate, function (event) {
      $(this).text(event.strftime("%D Kun %H:%M:%S"));
    });
  }

  /* ==================================================================
	6.0 Set Teaser FPS (Optional)
	================================================================== */
  //TweenLite.ticker.fps(25);

  /* ==================================================================
	7.0 Initialize Sven Teaser Plugin
	================================================================== */
  var $svenContainer = $(".sven-container");
  var freezeProp = $svenContainer.attr("data-freeze-prop")
    ? parseBool($svenContainer.attr("data-freeze-prop"))
    : true;

  // Merge custom animations with the existing animations
  if (typeof svenCustom !== "undefined") {
    svenAnimations = $.extend(svenAnimations, svenCustom);
  }

  /* Set autostart to false on mobiles */
  var autoStartProp = true; // By default, autoStart is set to "true"
  if (isMobile.any) {
    // You can use "isMobile.phone" "isMobile.tablet" to target either phones or tablets
    autoStartProp = false;
  }

  /* Set preloadMethod to "xhr" for iOS to fix audio play*/
  var preMethod = "tag";
  if (isMobile.apple.device) {
    preMethod = "xhr";
  }

  /* Set easeOuterGPU to "false" for firefox and iOS to fix text blur */
  var easeGPU = false;
  if (isFirefox || isMobile.apple.device) {
    easeGPU = true;
  }

  /* Initiate Sven Teaser Plugin */
  $svenContainer.svenPlugin({
    // General Options
    autoStart: autoStartProp,
    fullDuration: "default",
    letterBoxing: true,
    force3DOnDevices: false,
    easeOuterGPU: easeGPU,
    preloadScenes: false,
    videoOnMobiles: true,

    // preload options
    preloadMethod: preMethod,
    preloadFiles: [],
    fileTimeout: 8000,
    audioTimeout: 8000,
    initAfter: 80,

    // other options
    colors: ["#E7464F", "#CDAA20", "#80993B", "#07BABA", "#9B2C9D"],
    showAnimationSummary: false,
    freezeOnBlur: freezeProp,
    videoPlaybackChange: false,

    // callback functions
    // 1- onTeaserReady, 2- onTeaserStart, 3- onTeaserEnd
    // 4- onBeforeScene, 5- onBeforeIn, 6 - onBeforeFreeze
    // 7- onBeforeOut, 8- onAfterScene
    onTeaserReady: function () {
      $(".mbYTP_wrapper").css("visibility", "hidden");
      // Hide preloader here
      $(".loader-container").hide();

      // Show Splash Page content
      if (!autoStartProp) {
        $(".splash-page").show();
      }
    },
    onTeaserEnd: function () {
      revealTL.play(); // Continue to main site automatically on taeser end
    },
    onTeaserStart: function () {
      $(".sven-container").focus();

      // adjust line height to fix the text to center. (some fonts wont need this)
      $(".lt-main").css({ "line-height": "1" });

      // show controls here
      $(".pl-wrapper").show();
    },
  });

  /* ==================================================================
	9.0 Page Reveal Animation
	================================================================== */
  var revealTL = new TimelineMax({
    paused: true,
  });
  var revealEl = $(".revealer");
  revealTL.to(revealEl, 0.525, {
    x: "0%",
    ease: Expo.easeOut,
    onComplete: revealMain,
    onCompleteParams: [],
  });
  revealTL.to(
    revealEl,
    0.525,
    {
      x: "100%",
      ease: Expo.easeIn,
    },
    "+=0.45"
  );

  function revealMain() {
    $(".sven-wrapper").hide();
    $("#main-wrapper").show();
    setImageBase();
    objectFitImages("img.ofit");
    if ($("#bits").length) {
      initStompBits();
    }
    if ($("#particles-js").length) {
      initStompParticles();
    }
  }

  /* ==================================================================
	9.0 Teaser Controls (Play / Pause / Restart/ Mute / Skip)
	================================================================== */
  /* 1. Skip To Main Site / Content */
  $(".pl-skip").on("click", function (ev) {
    $svenContainer.svenPlugin.pauseTeaser();
    revealTL.play();
  });

  /* 2.  Play / Pause / Restart Teaser control */
  $(".pl-play").on("click", function (ev) {
    $svenContainer.svenPlugin.togglePlay();
  });

  /* 3.  Splash Page Get Started Button */
  $(".play-button").on("click", function (ev) {
    if (!isMobile.apple.device) {
      // to fix the audio bug in android
      $svenContainer.svenPlugin.togglePlay();
      $svenContainer.svenPlugin.togglePlay();
    }

    TweenMax.to($(".splash-page"), 0.5, {
      x: "-100%",
      onComplete: function () {
        $svenContainer.svenPlugin.togglePlay();
        $(".splash-page").remove();
      },
    });
  });

  // Play / Pause teaser by pressing "SPACEBAR" on keyboard.
  $(document).on("keydown", function (e) {
    if (
      $svenContainer.is(":visible") &&
      !$("#subscribe-page").is(":visible") &&
      e.keyCode === 32
    ) {
      $svenContainer.svenPlugin.togglePlay();
    }
  });

  /* 4. Mute / UnMute Teaser Sound */
  $(".pl-sound").on("click", function (ev) {
    if ($(this).parent().hasClass("highlight")) {
      // Do nothing
    } else {
      $svenContainer.svenPlugin.toggleSound();
    }
  });

  // The teaser triggers a specific event for each state. We change icons / text of controls here
  var $playIcon = $(".pl-play");
  var $volumeIcon = $(".pl-sound");

  $svenContainer.on("STPlay", function () {
    $playIcon.html("PAUSE");
  });

  $svenContainer.on("STPause", function () {
    $playIcon.html("PLAY");
  });

  $svenContainer.on("STEnd", function () {
    $playIcon.html("RESTART");
  });

  $svenContainer.on("STMuted", function () {
    $volumeIcon.addClass("strike");
  });

  $svenContainer.on("STUnMuted", function () {
    $volumeIcon.removeClass("strike");
  });

  /* ==================================================================
	10.0 Subscription / Contact Form
	================================================================== */
  $("[type='submit']").on("click submit", function (event) {
    var formEl = $(this).closest("form");
    var msgLabel = formEl.prevAll(".sven-message:first");
    var formData = formEl.serialize();
    var $inputBoxes = $("input, [type='submit']", "#" + formEl[0].id);
    $inputBoxes.prop("disabled", true);
    msgLabel.css("visibility", "hidden");
    msgLabel
      .css("visibility", "visible")
      .html('<i class="fa fa-hourglass-start"></i>adding your email...');
    var url = formEl.attr("action");
    $.ajax({
      type: "POST",
      url: url,
      data: formData, // serializes the form's elements.
      dataType: "json",
      success: function (data) {
        if (data.error) {
          msgLabel.css("visibility", "hidden");
          msgLabel
            .removeClass("error success")
            .addClass("error")
            .css("visibility", "visible")
            .html('<i class="fa fa-times"></i>' + data.message);
          $inputBoxes.prop("disabled", false);
        } else {
          msgLabel.css("visibility", "hidden");
          msgLabel
            .removeClass("error success")
            .addClass("success")
            .css("visibility", "visible")
            .html('<i class="fa fa-check"></i>' + data.message);
        }
      },
      error: function () {
        msgLabel.css("visibility", "hidden");
        msgLabel
          .removeClass("error success")
          .addClass("error")
          .css("visibility", "visible")
          .html(
            '<i class="fa fa-times"></i>Problem connecting to server. Please try again'
          );
        $inputBoxes.prop("disabled", false);
      },
    });
    event.preventDefault();
  });
});
