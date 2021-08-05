/*!
 * JavaScript's missing parseBool (https://github.com/bucaran/parsebool)
 * Copyright (c) 2015, Jorge Bucaran <jbucaran@me.com>
 * Licensed under the MIT license
 */
"use strict";function parseBool(e,r){return r=r||{},function(e){return"false"===e?!1:"true"===e?!0:r.force?!!e:e}(r.ignoreCase&&"string"==typeof e?e.toLowerCase():e)}

/*!
 * Vertical Center Bootstrap Modal

 * Author: Cory LaViska
*/
$(function(){"use strict";function i(){var i=$(this),o=i.find(".modal-dialog");i.css("display","block"),o.css("margin-top",Math.max(0,($(window).height()-o.height())/2))}$(".modal").on("show.bs.modal",i),$(window).on("resize",function(){$(".modal:visible").each(i)})});

/*!
 * debouncedresize: special jQuery event that happens once after a window resize
 *
 * latest version and complete README available on Github:
 * https://github.com/louisremi/jquery-smartresize
 *
 * Copyright 2012 @louis_remi
 * Licensed under the MIT license.
 *
 * This saved you an hour of work?
 * Send me music http://www.amazon.co.uk/wishlist/HNTU0468LQON
 */
!function(e){"use strict";var n,t,i=e.event;n=i.special.debouncedresize={setup:function(){e(this).on("resize",n.handler)},teardown:function(){e(this).off("resize",n.handler)},handler:function(e,r){var o=this,s=arguments,u=function(){e.type="debouncedresize",i.dispatch.apply(o,s)};t&&clearTimeout(t),r?u():t=setTimeout(u,n.threshold)},threshold:150}}(jQuery);

/*!
 * RoundTo nearest multiple
*/
Number.prototype.roundTo=function(a){var b=this%a;return b<=a/2?this-b:this+a-b};
