
var $flickrSearch = $("#flickr-search").val();



var clear = function(){
  $("#viewer-container").html("");
}


var search = function(){

  var flickrBaseURL =
  "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=";
  var api_key = "fa3e0832f30851339c73d3dd3c27f961";
  var $flickrSearch = "&tags=" + $("#flickr-search").val();
  var tag_mode = "&tag_mode=all";                 //results must contain all search terms
  var sort = "&sort=interestingness-desc";        //sort order
  var content_type = "&content_type=1";           //only photos
  var format = "&format=json&nojsoncallback=1";   //format of results

  var flickrRequest = flickrBaseURL + api_key + $flickrSearch + tag_mode
                      + sort + content_type +format;

  //so we know what size we're getting
  function loadPhotos(data) {
    var viewer = '<ul class="bxslider">';
    for (var i=0; i < 50; i++){
      //assemble the URL of the photo
      //https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}_[mstzb].jpg
      var farm = data.photos.photo[i].farm;
      var server = data.photos.photo[i].server;
      var id = data.photos.photo[i].id;
      var secret = data.photos.photo[i].secret;

      var photoURL = "https://farm" + farm + ".staticflickr.com/" + server
      + "/" + id + "_" + secret + "_c.jpg";  //underscore letter signals size of resultb

      viewer = viewer +  '<li><img src="'+ photoURL +'"></li>'

    }
    viewer = viewer + '</ul>';
    $("#viewer-container").append(viewer);
    $('.bxslider').bxSlider({
      pager: true,
      pagerType:'short',  //use numbers instead of dots
      captions: true      //will show captions from text in title field of <img>
    });
  }
  $.getJSON(flickrRequest, loadPhotos)

}



$('#search-form').submit(function(event) {
  console.log("in submit");
  event.preventDefault();
  clear();
  search();
});

$(document).ready(function(){ //run on load with stock photos
  $('.bxslider').bxSlider();
});

