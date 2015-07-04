// plans.js for plan.html

    function loadPhoto(data){
      var viewer = '<ul class="bxslider">';

      //data.photos.photo.length will give you total number of results
      for (var i=0; i < 50; i++){
        //assemble the URL of the photo
        //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
        var farm = data.photos.photo[i].farm;
        var server = data.photos.photo[i].server;
        var id = data.photos.photo[i].id;
        var secret = data.photos.photo[i].secret;
        // console.log("data.photos", data.photos);

        var photoURL = "https://farm" + farm + ".staticflickr.com/" + server
        + "/" + id + "_" + secret + "_b.jpg";  //underscore letter signals size of resultb
        // z medium 640, 640 on longest side
        // c medium 800, 800 on longest side
        // b large, 1024 on longest side
        // h large 1600, 1600 on longest side

        var owner = data.photos.photo[i].owner;
        var attrURL = "https://www.flickr.com/photos/" + owner + "/" + id + "/";

        var title = data.photos.photo[i].title;
        var newCaption = '<div class="newCaption"><a href="'
                          + attrURL + '"><p>' + title + '</p></a></div>';

        viewer = viewer +  '<li><img src="'+ photoURL + '">'+ newCaption +'</li>' ;

      }
      viewer = viewer + '</ul><div id="hearts" class="openHeart"></div>';
      photoClear();
      $("#viewer-container").append(viewer);
      
      var slider = $('.bxslider').bxSlider({
        pager: true,
        pagerType:'short',  //use numbers instead of dots
        captions: false ,    //will show captions from text in title field of <img>
        adaptiveHeight: true,
        slideWidth: 850,
        maxSlides: 1,

  //      onSliderLoad: function(currentIndex){
  //        var slider = this;
  //        console.log("slider",slider);
  //        console.log("currentIndex",currentIndex);
  //        var currentSlide = slider.getCurrentSlide(currentIndex);
  //       console.log(currentSlide);
  //       var currentImgURL = currentSlide[0].children[0].src;
  //        setupHearts(currentImgURL);
  //      },
        onSlideAfter: function(currentSlide, previousSlideNumber, currentSlideNumber){
          var current = slider.getCurrentSlide();
          var currentImgURL = currentSlide[0].children[0].src;
          setupHearts(currentImgURL);
        }
      });
    }
