var Gallery = {
  imageClicked: function() {
    Gallery.showThumbnail($(this));
  },
  
  showThumbnail: function(image) {
    $("#thumbnails img").removeClass("selected")
    $(image).addClass("selected")
    getFlickrJSON("flickr.photos.getInfo&photo_id=" + $(image).attr("data-photoid"), Gallery.showImage)  
  },
  
  showImage: function(data) {
    var element = data.photo

    var photo = { 
      "title": element.title._content, 
      "description": element.description._content, 
      "tags": element.tags.tag,
      "main-image": {
        "@src": flickrImageSrcLg(element), 
        "@title": element.title._content, 
        "@data-photoid": element.id
      }};
      
    $('#gallery-image-main').html($('#image-main-template').expand(photo))
  }, 
  
  initialize: function(setid) {
    getFlickrJSON("flickr.photosets.getPhotos&photoset_id=" + setid, createImages)
  }
};

function showNav() {
  $('.nav').css('display','block');
}

function flickrImageSrcLg(photo) {
  return "http://farm" + photo.farm + ".static.flickr.com/" + photo.server +"/" + photo.id + "_" + photo.secret + ".jpg";
}
function flickrImageSrc(photo) {
  return "http://farm" + photo.farm + ".static.flickr.com/" + photo.server +"/" + photo.id + "_" + photo.secret + "_s.jpg";
}

function flickrNavClicked() {
  getFlickrJSON("flickr.photosets.getPhotos&photoset_id=" + $(this).attr("data-setid"), createImages)
  $(".nav-link").removeClass("selected");
  $(this).addClass("selected");
}

function createImages(data) {
  var images = $.map(data.photoset.photo, function(element, index) {
    return {"gallery-image": {"@src": flickrImageSrc(element), "@title": element.title, "@data-photoid": element.id}};
  });
  
  $('#thumbnails').html($('#gallery-images-template').expand(images))
  Gallery.showThumbnail($($('.gallery-image')[0]))
}

function createNavigation(data) {
  var navigation = $.map(data.photosets.photoset, function(element, index) {
    return {"nav-link": {"@data-setid": element.id, title: element.title._content, photoCount: element.photos}};
  })
  
  $('#navigation-template').expand(navigation).appendTo("#main-nav")

  $($(".nav-link")[0]).addClass("selected")
  Gallery.initialize($($(".nav-link")[0]).attr("data-setid"))
}

function getFlickrJSON(api_method, callback) {
  var caylasUserId = "22691397@N06"
  $.getJSON("http://www.flickr.com/services/rest/?jsoncallback=?&format=json&api_key=928eb0a241e0efcbf637a628313cb06b&method="+ api_method, callback);        
}

getFlickrJSON("flickr.photosets.getList&user_id=22691397@N06", createNavigation)
$(".gallery-image").live("click", Gallery.imageClicked);
$(".nav-link").click(flickrNavClicked)
