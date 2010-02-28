var Gallery = {
  imageClicked: function() {
    Gallery.showThumbnail($(this));
  },
  
  showThumbnail: function(image) {
    $("#thumbnails img").removeClass("selected")
    $(image).addClass("selected")
    getFlickrJSON("flickr.photos.getInfo&photo_id=" + $(image).attr("data-photoid"), Gallery.showImage);
  },
  
  showImage: function(data) {
    var element = data.photo

    var photo = { 
      "title": element.title._content,
      "description": element.description._content, 
      "tags": $.map(element.tags.tag, function(item, index) { return {innerHTML: item.raw}; }),
      "main-image": {
        "@src": flickrImageSrcLg(element), 
        "@title": element.title._content, 
        "@data-photoid": element.id
      }};
      
    $('#gallery-image-main').html($('#image-main-template').expand(photo));
    
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
  theImages = $.map(data.photoset.photo, function(element, index) {
    return {"gallery-image": {"@src": flickrImageSrc(element), "@title": element.title, "@data-photoid": element.id}};
  });
  
  theImagesPage = 0
  setThumbnails();
  Gallery.showThumbnail($($('.gallery-image')[0]))  
}


function createNavigation(data) {
  var navigation = $.map(data.photosets.photoset, function(element, index) {
    return {"nav-link": {"@data-setid": element.id, title: element.title._content, photoCount: element.photos}};
  })
  
  $('#navigation-template').expand(navigation).prependTo("#main-nav")

  $($(".nav-link")[0]).addClass("selected")
  Gallery.initialize($($(".nav-link")[0]).attr("data-setid"))
}

function getFlickrJSON(api_method, callback) {
  var caylasUserId = "22691397@N06"
  $.getJSON("http://www.flickr.com/services/rest/?jsoncallback=?&format=json&api_key=928eb0a241e0efcbf637a628313cb06b&method="+ api_method, callback);        
}

function nextThumbnails() {
  theImagesPage = theImagesPage + 1;
  setThumbnails();
}

function previousThumbnails() {
  theImagesPage = theImagesPage - 1;
  setThumbnails();
}

function setThumbnails() {
  var start = theImagesPage * 4
  var end = start + 4
  
  if(theImages.length <= end) {
    $("#thumbnail-next").addClass("disabled");
  } else {
    $("#thumbnail-next").removeClass("disabled");
  }
  
  if(theImagesPage == 0) {
    $("#thumbnail-previous").addClass("disabled");
  } else {
    $("#thumbnail-previous").removeClass("disabled");
  }
  
  
  images = theImages.slice(start,end);
  
  $('#thumbnails').html(null)
  $('#gallery-images-template').expand(images).attr('id', 'carousel').appendTo("#thumbnails")
}

getFlickrJSON("flickr.photosets.getList&user_id=22691397@N06", createNavigation)
$(".gallery-image").live("click", Gallery.imageClicked);

$(".nav-link").click(flickrNavClicked)

$("#thumbnail-next").click(nextThumbnails);
$("#thumbnail-previous").click(previousThumbnails);

