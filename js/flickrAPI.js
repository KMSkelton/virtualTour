var clear = function(){
  $("#viewer-container").html("");
}

var search = function(){
  var $flickrSearch =  $("#flickr-search").val();

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

  var placeTag = "&place_id=";

  function findPlaceID(data){
    var placeID = data.places.place[0].place_id;
    function loadPhotos(data){
      var viewer = '<ul class="bxslider">';
      for (var i=0; i < data.photos.photo.length; i++){
        //assemble the URL of the photo
        //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
        var farm = data.photos.photo[i].farm;
        var server = data.photos.photo[i].server;
        var id = data.photos.photo[i].id;
        var secret = data.photos.photo[i].secret;

        var photoURL = "https://farm" + farm + ".staticflickr.com/" + server
        + "/" + id + "_" + secret + "_c.jpg";  //underscore letter signals size of resultb

        var title = data.photos.photo[i].title;

        viewer = viewer +  '<li><img src="'+ photoURL +'" title="' + title + '"></li>'
      }
      viewer = viewer + '</ul>';
      $("#viewer-container").append(viewer);
      $('.bxslider').bxSlider({
        pager: true,
        pagerType:'short',  //use numbers instead of dots
        captions: true      //will show captions from text in title field of <img>
      });
    }
    console.log("$flickrSearch", $flickrSearch);
    var flickrRequest = flickrBaseURL + method_photoSearch + api_key + photoQuery +
              + $flickrSearch + placeTag + placeID + format;
    console.log(flickrRequest);
    $.getJSON(flickrRequest, loadPhotos);

  }
  $.getJSON(placeIDRequest, findPlaceID);
}

$('#search-form').submit(function(event) {
  event.preventDefault();
  clear();
  search();
});

$(document).ready(function(){ //run on load with stock photos
  $('.bxslider').bxSlider();
});

