var wikiSearch = function(){
  console.log("in wikiSearch");

  var $wikiSearch =  $("#location-search").val();

  var wikiBaseURL ="https://en.wikipedia.org/w/api.php?";
  var wikiAction ="action=query";
  var wikiProp ="&prop=extracts";
  var wikiFormat = "&format=json";
  var wikiSize = "&exchars=250";
  var wikiIntro = "&exintro=";
  var wikiPageID = "&indexpageids="
  var wikiTitleTag ="&titles=";

  var wikiRequest = wikiBaseURL + wikiAction + wikiProp
  + wikiFormat + wikiIntro + wikiPageID + wikiTitleTag + $wikiSearch;

  // $.getJSON(wikiRequest, function(){
  //   console.log(data);
  // });


  $.ajax({
    url: wikiRequest,
    jsonp: "callback",
    dataType: "jsonp",
    success: function( data ) {
      console.log( "data.query", data.query); // server response
      var pageID = data.query.pageids[0];
      console.log("pageID", pageID);
      console.log("data.query.pages", data.query.pages);

      console.log("data.query.pages[pageID]", data.query.pages[pageID]);
      console.log("data.query.pages[pageID].extract", data.query.pages[pageID].extract);
      var extract = data.query.pages[pageID].extract;
      $("#wikiScrollBox").html(extract);


    }
  });
}


var photoClear = function(){
  $("#viewer-container").html("");
}

var photoSearch = function(){
  console.log("in photoSearch")
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
    console.log("in findFlickrPlaceID");
    var placeID = data.places.place[0].place_id;
    function loadPhotos(data){
      var viewer = '<ul class="bxslider">';
      //data.photos.photo.length
      for (var i=0; i < 50; i++){
        //assemble the URL of the photo
        //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
        var farm = data.photos.photo[i].farm;
        var server = data.photos.photo[i].server;
        var id = data.photos.photo[i].id;
        var secret = data.photos.photo[i].secret;

        var photoURL = "https://farm" + farm + ".staticflickr.com/" + server
        + "/" + id + "_" + secret + "_b.jpg";  //underscore letter signals size of resultb

        var title = data.photos.photo[i].title;

        viewer = viewer +  '<li><img src="'+ photoURL +'" title="' + title + '"></li>'
      }
      viewer = viewer + '</ul>';
      photoClear();
      $("#viewer-container").append(viewer);
      var slider = $('.bxslider').bxSlider({
        pager: true,
        pagerType:'short',  //use numbers instead of dots
        captions: true , //will show captions from text in title field of <img>
        onSlideAfter: function(){
          // alert('A slide has finished transitioning. Bravo. Click OK to continue!');
          var current = slider.getCurrentSlide();
          console.log("current is:", current);
        }
      });
    }
    console.log("$flickrSearch", $flickrSearch);

    //construct the request
    // base + method + api + photoQuery + flickrSearch + <-- always first
    // freshness + sort + type + placeTag + placeID + ingallery <-- must be in this order
    // +format <--always last

    var flickrRequest = flickrBaseURL + method_photoSearch + api_key
                    + photoQuery + $flickrSearch
                    + freshness + sort + content_type +format;
                    // + placeTag + placeID + format;
    console.log(flickrRequest);
    $.getJSON(flickrRequest, loadPhotos);
  }
  $.getJSON(placeIDRequest, findFlickrPlaceID);
}

$('#search-form').submit(function(event) {
  console.log("clicked search");
  event.preventDefault();
  photoSearch();
  wikiSearch();
});

$(document).ready(function(){ //run on load with stock photos
  $('.bxslider').bxSlider();
});

