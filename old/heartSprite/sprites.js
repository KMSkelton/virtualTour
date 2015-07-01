$(document).ready(function() {
  $('#hearts').click(function() {
    if ($(this).hasClass('openHeart')) {
      $(this).addClass('filledHeart').removeClass('openHeart');
    } else if ($(this).hasClass('filledHeart')) {
      $(this).addClass('brokenHeart').removeClass('filledHeart');
    } else {
      $(this).fadeOut(500).addClass('openHeart').fadeIn(500).removeClass('brokenHeart');
    };
  });
});
