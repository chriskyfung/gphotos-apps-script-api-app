# gphotos-apps-script-api-app

Testing Google Photos API via Google Apps 

## Functions
- Create a new shared album and return its shareable URL
- Find `Album ID` of a shared album with a specific shareable URL
- Unshare a shared album with a specific `Shared Album ID`
- Search media items of a specific date and render the images with a grid layout in a HTML file.
- (Work in progress) Add media items to a specific album.

* * *

## How to Use

1. Go to your Google Drive, open a new Apps Script Project.
2. Copy all .gs and html files to the project.
3. Go to Google Cloud Platform, create a new project.
4. Enable Google Photos API in the GCP web console.
5. Create an OAuth credentials. Choose Web Application as the application type.
When prompted for the authorized redirect URL enter `https://script.google.com/macros/d/{SCRIPTID}/usercallback` and replace `{SCRIPTID}` with the Script ID under the 'Project properties' of Apps Script Editor.
6. Add a product name to the consent screen, and Save.
7. Go back to the Apps Script project, select 'Libraries...' from the Resources menu. Enter `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF` next to 'Add a library' and click add to import the Google OAuth2 library, click Save.
8. Open `code.gs` in the Script Editor, replace the values of the following variables,
   - ClientID = '<your-client-id>'
   - ClientSecret = '<your-client-secret>'
   - ApiKey = '<your-Google-Photos-API-key>'
   - var execUrl = '<your-google-apps-script-web-app-url>'
9. Deploy the project as a web application. Choose 'Me (your-username@gmail.com)' under **Execute the app as**, and `Only myself` or `Anyone` under **Who has access to the app** depending on your usage.
10. Use the debug tool to run the `doGet()` function, and authorize for Google Services.
11. Open a new tab in your browser, copy the URL of your deployed app and try to execute an app function.You'll see one of the authorization dialogs shown here when it is run.
12. Embed the application to a HTML page using `<iFrame>`, if you don't want to see the Google signature at the top of the web app.

#### Revoke or Re-Authorize
1. Go to https://myaccount.google.com/.
2. On the left navigation panel, select Security.
3. On the Third-party apps with account access panel, select Manage third-party access.
4. Select the app called `Photos`/`photos`.
5. Select Remove Access.
6. Go back to the Apps Script Editor, use the debug tool to run `logout()` function in the script file `code.gs`.

* * *

## References
1. [Google Photos APIs  |  Google Developers](https://developers.google.com/photos)
2. [Web Apps  |  Apps Script  |  Google Developers](https://developers.google.com/apps-script/guides/web)