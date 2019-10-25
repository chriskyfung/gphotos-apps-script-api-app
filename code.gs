// script settings
var ClientID = '<your-client-id>'; Oauth ClientID
var ClientSecret = '<your-client-secret>'; // Oauth ClientSecret
var MaxLength = 50000000;
var ApiKey = '<your-Google-Photos-API-key>'; // Google Photos API key
var execUrl = '<your-google-apps-script-web-app-url>'; // Deployed App URL, in form of https://script.google.com/macros/s/{SCRIPTID}/exec

function doGet(e){
  Logger.log(e)
  var photos = getPhotosService();
    if (!photos.hasAccess()) {
      var authorizationUrl = photos.getAuthorizationUrl();
      Logger.log(authorizationUrl);
      return HtmlService.createHtmlOutput(authorizationUrl);
    }
  if (e.parameter['name']) {
    var name = e.parameter['name'];
    var output = runCreateSharedAlbum(name);
    var template = HtmlService.createTemplateFromFile('response.html');
    template.url = output;
    template.name = name;
    return template.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } else if (e.parameter['date']) {
    var datestr = e.parameter['date'];
    var imageList = runGetItemsOnDate(datestr);
    return composeHTMLouput(imageList).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } else if (e.parameter['url'] && e.parameter['action']) {
    var url = e.parameter['url'];
    var action = e.parameter['action'];
    if (action == "unshare") {
      runUnsharedAlbum(id);
    };
  } else {
    var output = HtmlService.createTemplateFromFile("index.html");
    output.execUrl = execUrl;
    return output.evaluate().setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  };
}

function doPost(e){
  Logger.log(e);
  
 if (e.parameter['formId'] == 'imp' && e.parameter['image[]']) {
    var selectedImageIds = e.parameters['image[]']
    return ContentService.createTextOutput(selectedImageIds[0]);
 } else {
   return HtmlService.createHtmlOutput('Invalid Input(s)');
 }
}

// functions below adapted from Google OAuth example at https://github.com/googlesamples/apps-script-oauth2

function getPhotosService() {
  // Create a new service with the given name. The name will be used when
  // persisting the authorized token, so ensure it is unique within the
  // scope of the property store.
  return OAuth2.createService('photos')

      // Set the endpoint URLs, which are the same for all Google services.
      .setAuthorizationBaseUrl('https://accounts.google.com/o/oauth2/auth')
      .setTokenUrl('https://accounts.google.com/o/oauth2/token')

      // Set the client ID and secret, from the Google Developers Console.
      .setClientId(ClientID)
      .setClientSecret(ClientSecret)

      // Set the name of the callback function in the script referenced
      // above that should be invoked to complete the OAuth flow.
      .setCallbackFunction('authCallback')

      // Set the property store where authorized tokens should be persisted.
      .setPropertyStore(PropertiesService.getUserProperties())

      // Set the scopes to request (space-separated for Google services).
      // see https://developers.google.com/fit/rest/v1/authorization for a list of Google Fit scopes
      .setScope('https://www.googleapis.com/auth/photoslibrary https://www.googleapis.com/auth/photoslibrary.readonly https://www.googleapis.com/auth/photoslibrary.readonly.appcreateddata https://www.googleapis.com/auth/photoslibrary.sharing')

      // Below are Google-specific OAuth2 parameters.

      // Sets the login hint, which will prevent the account chooser screen
      // from being shown to users logged in with multiple accounts.
      //.setParam('login_hint', Session.getActiveUser().getEmail())

      // Requests offline access.
      .setParam('access_type', 'offline')

      // Forces the approval prompt every time. This is useful for testing,
      // but not desirable in a production application.
      .setParam('approval_prompt', 'force');
}


function authCallback(request) {
  var photos = getPhotosService();
  var isAuthorized = photos.handleCallback(request);
  if (isAuthorized) {
    return HtmlService.createHtmlOutput('Success! You can close this tab.');
  } else {
    return HtmlService.createHtmlOutput('Denied. You can close this tab');
  }
}

function logon(){
  var photos = getPhotosService();
  
  if (!photos.hasAccess()) {
    var authorizationUrl = photos.getAuthorizationUrl();
    Logger.log(authorizationUrl);
    return HtmlService.createHtmlOutput(authorizationUrl)
  }
}

function logout() {
  var photos = getPhotosService();
  photos.reset();
}

function clearProps() {
  PropertiesService.getUserProperties().deleteAllProperties();
}