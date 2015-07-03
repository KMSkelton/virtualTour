var user = localStorage.uid;

function setupHearts(currentImgURL) {
         $('#hearts').click(function() {         //reattach click handler for heart
        if (typeof user == 'undefined') {
        //  alert("You must be logged in to save a photo");
        }
        if ($(this).hasClass('openHeart')) {
          $(this).addClass('filledHeart').removeClass('openHeart');
          console.log("calling savePhoto",user);
          savePhoto(currentImgURL,user);

        } else if ($(this).hasClass('filledHeart')) {
          $(this).addClass('brokenHeart').removeClass('filledHeart');

          $(this).delay(1000).queue(function(next) {
              $(this).fadeOut(500).addClass('openHeart').fadeIn(500).removeClass('brokenHeart');
              next();
          });
        } else {
          $(this).fadeOut(500).addClass('openHeart').fadeIn(500).removeClass('brokenHeart');
        };
          });
}
