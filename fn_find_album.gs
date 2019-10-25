function testFindAlbumId() {
   var shareableUrl ='<shareable-url-of-a-shared-album>'; // The url starts with 'https://photos.app.goo.gl/...'
   runFindAlbumId(shareableUrl)
}

function runFindAlbumId(url) {
  var photos = getPhotosService();
  
  var nextPageToken = null;
  var downloadList = [];
  
  // Limit of around 10,000 photos
  for (var page = 1; page <= 1000; page++) {
    Logger.log('Requesting page ' + page);
    
    var date = new Date();
    date.setDate(date.getDate() - 1);
    
    
    if (nextPageToken != null) {
      request["pageToken"] = nextPageToken;
    }
    var apiurl1 = 'https://photoslibrary.googleapis.com/v1/sharedAlbums?&pageSize=1&key=' + ApiKey;
    var response1 = UrlFetchApp.fetch(apiurl1, {
      headers: {
        Authorization: 'Bearer ' + photos.getAccessToken(),
        Accept: 'application/json'
      },
      'method' : 'get',
    });
    
    var json = JSON.parse(response1.getContentText());
    var productUrl = json.sharedAlbums[0].productUrl;
    if (productUrl == url) {
      return json.sharedAlbums[0].id;
    } else if (json.sharedAlbums[0].shareInfo) {
      var shareableURL = json.sharedAlbums[0].shareInfo.shareableUrl;
      if (shareableURL == url) {
        return json.sharedAlbums[0].id;
      }
    };
   
    if ('nextPageToken' in json) {
      nextPageToken = json.nextPageToken;
    } else {
      break;
    }
  }
}