mdui.$(function () {
  mdui.$(window).on('scroll', function (e) {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop !== 0) {
      mdui.$('#gotop').removeClass('mdui-fab-hide');
    } else {
      mdui.$('#gotop').addClass('mdui-fab-hide');
    }
  });
  mdui.$('#gotop').on('click', function (e) {
    (function animateScroll() {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop !== 0) {
        window.requestAnimationFrame(animateScroll);
        window.scrollTo(0, scrollTop - (scrollTop / 5));
      }
    })();
  });
});