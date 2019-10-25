function testAddMediaItems() {
 var albumId = '<your-album-id>'; // Replace with your own
 var imgIds = ['<a-media-item-id>']; // Replace with your own
  runAddMediaItems(albumId, imgIds);
}

function runAddMediaItems(id, photoIds) {
  var photos = getPhotosService();
  
  var request = {
    "mediaItemIds": imgIds
  }
  
  var apiurl = 'https://photoslibrary.googleapis.com/v1/albums/' + id + ':batchAddMediaItems?key=' + ApiKey;
  var response = UrlFetchApp.fetch(apiurl, {
    headers: {
      Authorization: 'Bearer ' + photos.getAccessToken(),
      Accept: 'application/json'
    },
    'method' : 'post',
    'contentType' : 'application/json',
    'payload' : JSON.stringify(request, null, 2)
  });
  
  var json = JSON.parse(response.getContentText());
  var success = json;
}