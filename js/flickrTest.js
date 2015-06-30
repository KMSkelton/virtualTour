var search = function(){
  var $flickrSearch = $("#flickr-search").val();
  var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
  var options = {
    tags: $flickrSearch,
    format: "json"
  };
  function loadPhotos(data) {
    var viewer = '<ul class="bxslider">';
    for (var i=0; i < data.items.length; i++){
      viewer = viewer + '<li><img src="' + data.items[i].media.m + '</li>';
    }
    viewer = viewer + '</ul>';
    $("#viewer-container").append(viewer);
    $('.bxslider').bxSlider();
  }
  $.getJSON(flickrAPI, options, loadPhotos);
}

$('#search-form').submit(function(event) {
  event.preventDefault();
  search();
});


