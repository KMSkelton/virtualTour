var flickrBaseURL= "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
var api_key = "fa3e0832f30851339c73d3dd3c27f961";
var $flickrSearch = $("#flickr-search").val();


var flickrRequest = flickrBaseURL + api_key + "&tags=london&format=json&nojsoncallback=1";


  var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  var options = {
    tags: "paris",
    format: "json"
  };

var search = function(){
  console.log("flickrRequest", flickrRequest);
  console.log("in search");
  $.getJSON(flickrRequest, function(data){
    console.log("in getJSON");
    console.log(data);
  });
}



$('#search-form').submit(function(event) {
  console.log("in submit");
  event.preventDefault();
  // clear();
  search();
});

