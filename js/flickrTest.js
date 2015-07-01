var clear = function(){
  $("#viewer-container").html("");
}
var search = function(){
  var $flickrSearch = $("#flickr-search").val();
  var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  var options = {
    tags: $flickrSearch,
    format: "json"
  };
  //search runs, but currently we only return fillmurray stock photos
  //so we know what size we're getting
  function loadPhotos(data) {
    var viewer = '<ul class="bxslider">';
    for (var i=0; i < data.items.length; i++){
      viewer = viewer +  '<li><img src="http://www.fillmurray.com/480/360"></li>'
      //this commented out code will insert search results from public Flickr feed
      // viewer = viewer + '<li><img src="' + data.items[i].media.m +
      // '" title="by ' + data.items[i].author + '"></li>';
      // console.log(data.items[i]);
    }
    viewer = viewer + '</ul>';
    $("#viewer-container").append(viewer);
    $('.bxslider').bxSlider({
      pager: true,
      pagerType:'short', //use numbers instead of dots
      captions: true    //will show captions from text in title field of <img>
    });
  }
  $.getJSON(flickrAPI, options, loadPhotos);
}
$('#search-form').submit(function(event) {
  event.preventDefault();
  clear();
  search();
});

$(document).ready(function(){ //run on load with stock photos
  $('.bxslider').bxSlider();
});
