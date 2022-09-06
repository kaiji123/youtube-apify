import * as fs from 'fs'
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
var OAuth2 = google.auth.OAuth2;

export class YoutubeAPI {

  private service: any = google.youtube('v3');
  // If modifying these scopes, delete your previously saved credentials
  // at ~/.credentials/youtube-nodejs-quickstart.json
  private SCOPES: string[] =
    [
      'https://www.googleapis.com/auth/youtube.readonly',
      'https://www.googleapis.com/auth/youtube.upload'
    ];

  private TOKEN_DIR: string = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
  private TOKEN_PATH: string = this.TOKEN_DIR + 'youtube-nodejs-quickstart.json';
  private secret = ''
  private code: string = '';
  private client:OAuth2Client;

  constructor() {

  }

  setTokenPath(path: string) {
    this.TOKEN_PATH = path;

  }
  getTokenPath() {
    return this.TOKEN_PATH;
  }
  addScope(scope: string) {
    this.SCOPES.push(scope);
  }
  /**
   * Store token to disk be used in later program executions.
   *
   * @param {Object} token The token to store to disk.
   */
  storeToken(token) {
    try {
      fs.mkdirSync(this.TOKEN_DIR);
    } catch (err) {
      if (err.code != 'EEXIST') {
        throw err;
      }
    }
    fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) throw err;
      console.log('Token stored to ' + this.TOKEN_PATH);
    });
  }
  resetCredentials() {
    fs.unlink(this.TOKEN_PATH, function (err) {
      if (err) throw err;
      // if no error, file has been deleted successfully
      console.log('File deleted!');
    });
    this.getNewToken();

  }
  getSecret() {
    return this.secret;
  }
  getScope(): string[] {
    return this.SCOPES;
  }
  /**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
*
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
  authorize() {
    let getNewToken = this.getNewToken;
 
    if (this.client == undefined){
      throw Error("You have not created a client yet. Please use loadSecret to load secret and create client")
    }
    // Check if we have previously stored a token.
    let token = fs.readFileSync(this.TOKEN_PATH);
    this.client.credentials = JSON.parse(String(token));
  }


  getNewCode(){
    if (this.client == undefined){
      throw Error("You have not created a client yet. Please use loadSecret to load secret and create client")
    }
    var authUrl = this.client.generateAuthUrl({
      access_type: 'offline',
      scope: this.SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
  }
  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   *
   * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback to call with the authorized
   *     client.
   */
  getNewToken(code:string = this.code) {

    if (code == undefined){
      throw Error("You have not set a code yet. Please use getNewCode.")
    }
    let client = this.client;
    if (client == undefined){
      throw Error("You have not created a client yet. Please use loadSecret to load secret and create client.")
    }
    let storeToken = this.storeToken;
   
 
    this.client.getToken(code, function (err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      client.credentials = token;
      
      storeToken(token);
    });
    this.client = client 

    return this.client;

  }

  setCode(code:string){
    this.code = code;
  }

  // Load client secrets from a local file.
  loadSecret(secretfile: string) {
    let secret = '';
    let data= fs.readFileSync(secretfile)
    this.secret = data.toString();
    console.log(this.secret);
    let credentials = JSON.parse(this.secret.toString());
    var clientSecret = credentials.web.client_secret;
    var clientId = credentials.web.client_id;
    var redirectUrl = credentials.web.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    this.client = oauth2Client;
 
  }
    /**
   * Lists the names and IDs of up to 10 files.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  getChannel(auth = this.client, username:string) {
    if (auth == undefined || auth.credentials == undefined){
      throw Error("You havent authorized yet");
    }
    this.service.channels.list({
      auth: auth,
      part: 'snippet,contentDetails,statistics',
      forUsername: username
    }, function (err, response) {
      if (err) {
        console.log('The API returned an error: ' + err);
        return;
      }
      console.log(response.data);
      var channels = response.data.items;
      if (channels.length == 0) {
        console.log('No channel found.');
      } else {
        console.log('This channel\'s ID is %s. Its title is \'%s\', and ' +
          'it has %s views.',
          channels[0].id,
          channels[0].snippet.title,
          channels[0].statistics.viewCount);
      }
    });
  }

  uploadVideo = (auth=this.client, videopath: string) => {
    if (auth == undefined || auth.credentials == undefined){
      throw Error("You havent authorized yet");
    }
    this.service.videos.insert(
      {
        auth: auth,
        part: 'snippet,contentDetails,status',
        resource: {
          // Video title and description
          snippet: {
            title: 'My title',
            description: 'My description'
          },
          // I set to private for tests
          status: {
            privacyStatus: 'private'
          }
        },

        // Create the readable stream to upload the video
        media: {
          body: fs.createReadStream(videopath) // Change here to your real video
        }
      },
      (error, data) => {
        if (error) {
          return console.log(error);
        }
        console.log("SUCCESSFUL UPLOAD")
        console.log('https://www.youtube.com/watch?v=' + data.data.id);
        return data.data.id;
      }
    );
  };
}
