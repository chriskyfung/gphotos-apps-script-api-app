function testUnsharedAlbum() {
   var sharedAlbumId = '<id-of-a-shared-album>'; // Replace with your own ID
   runLockSharedAlbum(sharedAlbumId, 'false')
}

function runUnsharedAlbum(id) {
  var photos = getPhotosService();
  var request = {
    }

    var apiurl = 'https://photoslibrary.googleapis.com/v1/albums/'+ id +':unshare?key=' + ApiKey;
    var response = UrlFetchApp.fetch( apiurl, {
      headers: {
        Authorization: 'Bearer ' + photos.getAccessToken(),
        Accept: 'application/json'
      },
      'method' : 'post',
      'contentType' : 'application/json',
      'payload' : JSON.stringify(request, null, 2)
    });

  if (isempty(request)) {
    return true;
  }
}