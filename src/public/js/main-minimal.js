/* =============================================================================================
* Table of Contents:
*
* 1.0 - Simple Fixes
* 2.0 - Initialize Custom scrollbar (only on Desktops)
* 3.0 - Initialize PhotoSwipe Gallery
* 4.0 - Initialize Countdown
* 5.0 - Subscription / Contact Form
============================================================================================= */
"use strict";

/* ==================================================================
	Global Variables
================================================================== */
window.lazySizesConfig = window.lazySizesConfig || {};
lazySizesConfig.preloadAfterLoad = 1; // load all images after the window onload event

/* ==================================================================
	Hide Preloader when the page is ready
================================================================== */
$(window).load(function(){
	$(".loader-container").hide();
});

$(function() {

	/* ==================================================================
	1.0 Simple Fixes
	================================================================== */

	/* Preloader Animation Fallback for ie9 */
	if (navigator.userAgent.indexOf('MSIE') != -1)
	var detectIEregexp = /MSIE (\d+\.\d+);/ //test for MSIE x.x
	else // if no "MSIE" string in userAgent
	var detectIEregexp = /Trident.*rv[ :]*(\d+\.\d+)/ //test for rv:x.x or rv x.x where Trident string exists
	if (detectIEregexp.test(navigator.userAgent)) { //if some form of IE
		var ieversion=new Number(RegExp.$1) // capture x.x portion and store as a number
		if (ieversion<=9) {
			$('body').addClass("loader-ie9");
		}
	}

	/* Set Minimum Height of the Content Container */
	var winH = $(window).height();
	$(".side-right").css("min-height", winH + "px");

	/* Set image container height to fit Vertical Rhythm */
	function setImageBase() {
		var baseLine = parseInt($(".vflow").css(".line-height"));
		var baseHeight = baseLine * 7;
		$(".ps-link").each(function(index, element) {
			var link = $(this);
			if(index == 0) {
				var resWidth = link.width();
				var origDim = link.attr("data-size").split("x");
				baseHeight = ((origDim[1] / origDim[0]) * resWidth).roundTo(30);
			}
			link.css("height", baseHeight + "px");
		});
	}
	setImageBase();
	objectFitImages('img.ofit');
	if($("#bits").length) {
        initStompBits();
    }
    if($("#particles-js").length) {
        initStompParticles();
    }


	/* ScrollTo Animation Fix */
	$(document).on("click","a[href^='#']",function(e){
		var href=$(this).attr("href"),
		target=$(href).parents(".mCustomScrollbar");
		if(target.length){
			e.preventDefault();
			target.mCustomScrollbar("scrollTo",href);
		} else {
			target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.substr(1) +']');
			if (target.length) {
				$('#main-wrapper').animate({
					scrollTop: target.offset().top
				}, 1000);
				return false;
			}
		}
	});

	/* Click "More Information" button to open split */
	$("#mi-btn, #close-info").on("click", function(e) {
		$("#main-wrapper").toggleClass("split-active");
	});

	/* Window resize functions */
	$(window).on('debouncedresize', function(){
		winH = $(window).height();
		$(".side-right").css("min-height", winH + "px");
		setImageBase();
	});

	/* ==================================================================
	2.0 Initialize Custom scrollbar (only on Desktops)
	================================================================== */
	if(!isMobile.any) {
		$('#main-wrapper').mCustomScrollbar({
			scrollInertia: 150,
			axis: "y"
		});
	} else {
		document.documentElement.className += " scroll-touch";
	}

	/* ==================================================================
	3.0 Initialize PhotoSwipe Gallery
	================================================================== */
	initPhotoSwipeFromDOM('.st-gallery');

	/* ==================================================================
	4.0 Initialize Countdown
	TTBD : Revert to previous version as in Sven
	================================================================== */
	$(".st-countdown").countdown("2017/12/01", function(event) {
		$(this).text(
			event.strftime('%D Days %H:%M:%S')
		);
	});

	/* ==================================================================
	5.0 Subscription / Contact Form
	================================================================== */
	$("[type='submit']").on('click submit', function(event) {
		var formEl = $(this).closest("form");
		var msgLabel = formEl.prevAll(".sven-message:first");
		var formData = formEl.serialize();
		var $inputBoxes = $('input, [type=\'submit\']', "#" + formEl[0].id);
		$inputBoxes.prop('disabled', true);
		msgLabel.css("visibility", "hidden");
		msgLabel.css("visibility", "visible").html('<i class="fa fa-hourglass-start"></i>adding your email...');
		var url = formEl.attr("action");
		$.ajax({
			type: "POST",
			url: url,
			data: formData, // serializes the form's elements.
			dataType: 'json',
			success: function(data) {
				if (data.error) {
					msgLabel.css("visibility", "hidden");
					msgLabel.removeClass("error success").addClass("error").css("visibility", "visible").html('<i class="fa fa-times"></i>' + data.message);
					$inputBoxes.prop('disabled', false);
				} else {
					msgLabel.css("visibility", "hidden");
					msgLabel.removeClass("error success").addClass("success").css("visibility", "visible").html('<i class="fa fa-check"></i>' + data.message);
				}
			},
			error: function() {
				msgLabel.css("visibility", "hidden");
				msgLabel.removeClass("error success").addClass("error").css("visibility", "visible").html('<i class="fa fa-times"></i>Problem connecting to server. Please try again');
				$inputBoxes.prop('disabled', false);
			}
		});
		event.preventDefault();
	});
});
