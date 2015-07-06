var removePrefix = function(rawExtract){
  //wikiVoyage prefixes some articles with disambiguation redirects enclosed in <dl>
  //this function searches for this prefix text and strips it off
  return rawExtract.replace(/<dl>(.|\n)*?<\/dl>/, "");
}

function wikiSearchExtract(wikiRequestExtract) {
  $.ajax({
    url: wikiRequestExtract,
    jsonp: "callback",
    dataType: "jsonp",
    success: function( data ) {
      var pageID = data.query.pageids[0];
      var cleanExtract = removePrefix(data.query.pages[pageID].extract);
      var extract = "<div class='wikiResult'>" + cleanExtract + "</div>";
      $("#wikiExtract").html(extract);
      localStorage.setItem("wikiExtract", wikiRequestExtract);
    },
    }).fail(function(error) {
      console.log("error with wikiSearchExtract", error);
    });
}

var isArticle = function(page){
  //if results have no pageID, it's not an article (bad search term)
  if (!page.pageid){
    return false;
  }
  var categoryArray = page.categories;
  //if it has a pageID, but no categoryArray, it is an article
  //return true early to avoid .length error
  if(!categoryArray){
    return true;
  }
  var isArticle = true;
  //iterate through categories to look for titles with "disambiguation"
  //and return not an article if it's just redirects
  for (var i=0; i < categoryArray.length && isArticle; i++){
    var currentCat = categoryArray[i].title;
    isArticle = (currentCat.indexOf("isambig") < 0);
  }
  return isArticle;
}

var wikiSearch = function(){
  var $wikiSearch =  $("#location-search").val();

  function toTitleCase(str) { //avoids WikiVoyage redirects based on non-Title case
    return str.replace(/\w\S*/g, function(txt){
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  var capitalSearch = toTitleCase($wikiSearch);

  var wikiBaseURL ="https://en.wikivoyage.org/w/api.php?";
  var wikiQuery ="action=query";

  var wikiCat = "&prop=categories";
  var wikiExtracts ="&prop=extracts";
  var wikiInfo = "&prop=info";
  var wikiGetURL = "&inprop=url";

  var wikiFormat = "&format=json";
  var wikiIntro = "&exintro=";
  var wikiPageID = "&indexpageids=";
  var wikiTitleTag = "&titles=";

  var wikiRequestCategory = wikiBaseURL + wikiQuery
    + wikiCat + wikiFormat + wikiPageID +wikiTitleTag + capitalSearch;

  var wikiRequestExtract = wikiBaseURL + wikiQuery
      + wikiExtracts + wikiFormat + wikiIntro + wikiPageID + wikiTitleTag + capitalSearch;

  var wikiRequestURL = wikiBaseURL + wikiQuery
      + wikiInfo + wikiFormat + wikiGetURL + wikiTitleTag + capitalSearch;

  $.ajax({
    url: wikiRequestCategory,
    jsonp: "callback",
    dataType: "jsonp",
    success: function( data ) {
      var pageID = data.query.pageids[0];
      if (isArticle(data.query.pages[pageID])){
        wikiSearchExtract(wikiRequestExtract);
        $.ajax({
          url: wikiRequestURL,
          jsonp: "callback",
          dataType: "jsonp",
          success: function( data ) {
            var wikiURL = data.query.pages[pageID].fullurl;
            var wikiLink = "<div><a href=" + wikiURL + ">Read more about " + capitalSearch + "...</a></div>";
            $("#wikiLink").html(wikiLink);
          }
        });
      } else {
        $("#wikiExtract").html("Can you be more specific with your search? WikiVoyage needs a more precise location.");
        $("#wikiLink").html("");
      }
    }
  });
} //end of wikiSearch()

var photoClear = function(){
  $("#viewer-container").html("");
}

var errorImage = function(){
  photoClear();
  var noFlickrResults = '<ul class="bxslider"><li><img src="images/earth-1024.jpg"></li></ul>'
  $("#viewer-container").append(noFlickrResults);
   var slider = $('.bxslider').bxSlider({
    pager: true,
    pagerType:'short',  //use numbers instead of dots
    captions: false ,    //will show captions from text in title field of <img>
    adaptiveHeight: true,
    slideWidth: 850,
    maxSlides: 1
  });
}

var photoSearch = function(){
  var $flickrSearch =  $("#location-search").val();

  var flickrBaseURL ="https://api.flickr.com/services/rest/";
  var api_key = "&api_key=fa3e0832f30851339c73d3dd3c27f961";

  var method_placeSearch = "?method=flickr.places.find";
  var placeQuery = "&query=";

  var format = "&format=json&nojsoncallback=1";   //format of results

  var placeIDRequest = flickrBaseURL + method_placeSearch + api_key
        + placeQuery + $flickrSearch + format;

  var method_photoSearch ="?method=flickr.photos.search";
  var photoQuery = "&tags=";
  var tag_mode = "&tag_mode=all";                 //results must contain all search terms
  var freshness = "&min_upload_date=1388534400&min_taken_date=1388534400" // taken and uploaded after 1-1-14
  var sort = "&sort=interestingness-desc";        //sort order
  var content_type = "&content_type=1";           //only photos
  var ingallery = "&in_gallery=1"

  var placeTag = "&place_id=";

  function findFlickrPlaceID(data){
    //var placeID = data.places.place[0].place_id;
    function loadPhotos(data){
      var viewer = '<ul class="bxslider">';
      //data.photos.photo.length will give you total number of results
      var numresults = 50;
      if (data.photos.photo.length < 1){
        errorImage();
        return;
      } else if (data.photos.photo.length < numresults){
        numresults = data.photos.photo.length;
      }

      for (var i=0; i < numresults; i++){

        //assemble the URL of the photo
        //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
        var farm = data.photos.photo[i].farm;
        var server = data.photos.photo[i].server;
        var id = data.photos.photo[i].id;
        var secret = data.photos.photo[i].secret;

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

        viewer = viewer +  '<li><img src="'+ photoURL + '">' + newCaption +'</li>' ;

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
        onSliderLoad: function(currentSlide,currentIndex){
          var currentSlideCaptionText = currentSlide[0].children[1].innerHTML;
          var currentImgURL = currentSlide[0].children[0].src;
          setupHearts(currentImgURL,currentSlideCaptionText);
          checkPhoto("check",currentImgURL,currentSlideCaptionText,localStorage.currentPlan, localStorage.uid);
          loadFavorites();
        },
        onSlideAfter: function(currentSlide, previousSlideNumber, currentSlideNumber){
          $("#hearts").unbind();  // remove the old handler
          var currentSlideCaptionText = currentSlide[0].children[1].innerHTML;
          var currentImgURL = currentSlide[0].children[0].src;
          setupHearts(currentImgURL,currentSlideCaptionText);  // add new handler
          checkPhoto("check",currentImgURL,currentSlideCaptionText,localStorage.currentPlan, localStorage.uid);
          loadFavorites();
        }
      });
    } //loadPhotos
    //construct the request
    // base + method + api + photoQuery + flickrSearch + <-- always first
    // freshness + sort + type + placeTag + placeID + ingallery <-- must be in this order
    // +format <--always last
    var flickrRequest = flickrBaseURL + method_photoSearch + api_key
                    + photoQuery + $flickrSearch
                    + freshness + sort + content_type +format;
                    // + placeTag + placeID + ingallery + format;
    $.getJSON(flickrRequest, loadPhotos).fail(function(error){
        console.log("get flickr failed", error);
      });
  } //findFlickrPlaceID
  $.getJSON(placeIDRequest, findFlickrPlaceID);
} // photoSearch

