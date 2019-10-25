function testGetItemsOnDate() {
  var imgList = runGetItemsOnDate('2019-09-27'); // Replace a date formatted in yyyy-mm-dd
  return composeHTMLouput(imgList);
}

function runGetItemsOnDate(dateStr) {
  var photos = getPhotosService();
  
  var dArray = dateStr.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  var year = parseInt(dArray[1], 10);
  var month = parseInt(dArray[2],10);
  var day = parseInt(dArray[3], 10);
  
  var nextPageToken = null;
  var imageList = [];
  
  // Limit of around 10,000 photos
  for (var page = 1; page <= 1000; page++) {
    Logger.log('Requesting page ' + page);
    
    var request = {
      "pageSize":"5",
      "filters": {
        "dateFilter": {
          "dates": [
            {
              "day": day,
              "month": month,
              "year": year
            }
          ]
        }
      }
    };
    
    if (nextPageToken != null) {
      request["pageToken"] = nextPageToken;
    }
    
    var apiurl = 'https://photoslibrary.googleapis.com/v1/mediaItems:search?key=' + ApiKey;

    var response = UrlFetchApp.fetch( apiurl , {
      headers: {
        Authorization: 'Bearer ' + photos.getAccessToken()
      },
      'method' : 'post',
      'contentType' : 'application/json',
      'payload' : JSON.stringify(request, null, 2)
    });
    
    var json = JSON.parse(response.getContentText()); 
    
    if ('mediaItems' in json) {
      var photoCount = json.mediaItems.length;
      for (var i = 0; i < photoCount; i++) {
        var itemId = json.mediaItems[i].id;
        var filename = json.mediaItems[i].filename;
        var baseUrl = json.mediaItems[i].baseUrl; 
        if ('photo' in json.mediaItems[i].mediaMetadata) {
          // if the photo property exists it's a photo and use =d to download, otherwise a video and we need to use =dv
          baseUrl += '=d';
        } else {
          baseUrl += '=dv';
        }
        
        imageList.push({
          "id" : itemId,
          "filename" : filename,
          "baseUrl" : baseUrl
        });
      }
    }
    
    if ('nextPageToken' in json) {
      nextPageToken = json.nextPageToken;
    } else {
      return imageList;
      break;
    }
  }
}

function composeHTMLouput(imageList) {
  var output = [];
  for (var i = 0; i < imageList.length; i++) {
    var template = HtmlService.createTemplate(
      '<div> \
       <label class="image-checkbox"> \
       <img class="img-responsive" src="<?= imgsrc ?>" /> \
       <input type="checkbox" name="image[]" value="<?=imgId ?>" /> \
       </label> \
       </div>');
    template.imgsrc = imageList[i].baseUrl;
    template.imgId = imageList[i].id;
    output += template.evaluate().getContent();
  }
  var HTMLtemplate = HtmlService.createTemplateFromFile('image_results.html');
  HTMLtemplate.execUrl = execUrl;
  HTMLtemplate.imageboxes = output;
  return HTMLtemplate.evaluate();
}

// functions below adapted from Google OAuth example at https://github.com/googlesamples/apps-script-oauth2
