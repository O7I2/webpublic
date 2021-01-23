const heyplay = {};

heyplay.onDOMTreeLoaded = function () {
	if (typeof Pjax!=="undefined") {
		heyplay.pjax = new Pjax({
			selectors: [
				"head", 
				"#content"
			]
		})
	}

	window.removeEventListener("DOMContentLoaded", heyplay.onDOMTreeLoaded);
};
heyplay.onLoaded = function () {
	if (typeof mdui!=="undefined") {
		mdui.$(function() {
			mdui.$(window).on('scroll', function (e) {
				var scrollTop = document.documentElement.scrollTop || 
				document.body.scrollTop;
				if (scrollTop !== 0) {
					mdui.$('#gotop').removeClass('mdui-fab-hide');
				} else {
					mdui.$('#gotop').addClass('mdui-fab-hide');
				};
			});
			mdui.$('#gotop').on('click', function (e) { 
				(function animateScroll() {
					var scrollTop = document.documentElement.scrollTop || 
					document.body.scrollTop; if (scrollTop !== 0) {
						window.requestAnimationFrame(animateScroll); 
						window.scrollTo(0, scrollTop - (scrollTop / 5));
					};
				})();
			});
		});
	};

	window.removeEventListener("load", heyplay.onLoaded);
};

window.addEventListener("DOMContentLoaded", heyplay.onDOMTreeLoaded);
window.addEventListener("load", heyplay.onLoaded);
