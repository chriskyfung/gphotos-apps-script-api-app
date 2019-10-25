function testCreateSharedAlbum() {
   runBackup('api test') // Test album name 
}

function runCreateSharedAlbum(name) {
  var photos = getPhotosService();
  
  var nextPageToken = null;
  var downloadList = [];
  
  // Limit of around 10,000 photos
  for (var page = 1; page <= 1000; page++) {
    Logger.log('Requesting page ' + page);
    
    var date = new Date();
    date.setDate(date.getDate() - 1);
    
    var request1 = {
      "album": {
        "title": name
      }
    };
    
    if (nextPageToken != null) {
      request["pageToken"] = nextPageToken;
    }
    var apiurl1 = 'https://photoslibrary.googleapis.com/v1/albums?key=' + ApiKey;
    var response1 = UrlFetchApp.fetch(apiurl1, {
      headers: {
        Authorization: 'Bearer ' + photos.getAccessToken(),
        Accept: 'application/json'
      },
      'method' : 'post',
      'contentType' : 'application/json',
      'payload' : JSON.stringify(request1, null, 2)
    });
    
    var json1 = JSON.parse(response1.getContentText());

    var request2 = {
      "sharedAlbumOptions": {
        "isCollaborative": true,
        "isCommentable": false
      }
    }

    var apiurl2 = 'https://photoslibrary.googleapis.com/v1/albums/'+ json1.id +':share?key=' + ApiKey;
    var response2 = UrlFetchApp.fetch( apiurl2, {
      headers: {
        Authorization: 'Bearer ' + photos.getAccessToken(),
        Accept: 'application/json'
      },
      'method' : 'post',
      'contentType' : 'application/json',
      'payload' : JSON.stringify(request2, null, 2)
    });

    var json2 = JSON.parse(response2.getContentText());
    var shareableUrl = JSON.stringify(json2.shareInfo.shareableUrl);
    return shareableUrl;
   
    if ('nextPageToken' in json1) {
      nextPageToken = json1.nextPageToken;
    } else {
      break;
    }
  }
}