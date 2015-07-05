function setupHearts(currentImgURL,currentSlideCaptionText) {
    $('#hearts').removeClass().addClass("openHeart");
    $('#hearts').click(function() {         //reattach click handler for heart
        if (typeof localStorage.uid == 'undefined') {
          alert("You must be logged in to save a photo");
          window.location = "http://localhost:8000/login-signup.html";
        }
        if ($(this).hasClass('filledHeart')) {
          $(this).removeClass().addClass('brokenHeart');
          //console.log("calling deletePhoto",currentImgURL,localStorage.currentPlan,localStorage.uid);
          checkPhoto("delete",currentImgURL,currentSlideCaptionText,"","",localStorage.currentPlan,localStorage.uid);
          $(this).delay(1000).queue(function(next) {
              $(this).removeClass().fadeOut(500).fadeIn(500).addClass('openHeart');
              next();
          });
        } else if ($(this).hasClass('openHeart')) {
          $(this).removeClass().addClass('filledHeart');
          var wikiLink = $("#wikiLink").html();
          //console.log("calling checkphoto in openheart","save",currentImgURL,currentSlideCaptionText,wikiLink,localStorage.wikiExtractURL,localStorage.currentPlan, localStorage.uid);
          checkPhoto("save",currentImgURL,currentSlideCaptionText,wikiLink,localStorage.wikiExtract,localStorage.currentPlan, localStorage.uid);
        }
    });
}

function savedHeart(){
   $('#hearts').removeClass().addClass("filledHeart");  
}