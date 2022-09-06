import { OAuth2Client } from 'google-auth-library';
export declare class YoutubeAPI {
    private service;
    private SCOPES;
    private TOKEN_DIR;
    private TOKEN_PATH;
    private secret;
    private code;
    private client;
    constructor();
    setTokenPath(path: string): void;
    getTokenPath(): string;
    addScope(scope: string): void;
    /**
     * Store token to disk be used in later program executions.
     *
     * @param {Object} token The token to store to disk.
     */
    storeToken(token: any): void;
    resetCredentials(): void;
    getSecret(): string;
    getScope(): string[];
    /**
  * Create an OAuth2 client with the given credentials, and then execute the
  * given callback function.
  *
  * @param {Object} credentials The authorization client credentials.
  * @param {function} callback The callback to call with the authorized client.
  */
    authorize(): void;
    getNewCode(): void;
    /**
     * Get and store new token after prompting for user authorization, and then
     * execute the given callback with the authorized OAuth2 client.
     *
     * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
     * @param {getEventsCallback} callback The callback to call with the authorized
     *     client.
     */
    getNewToken(code?: string): OAuth2Client;
    setCode(code: string): void;
    loadSecret(secretfile: string): void;
    /**
   * Lists the names and IDs of up to 10 files.
   *
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
    getChannel(auth: OAuth2Client, username: string): void;
    uploadVideo: (auth: OAuth2Client, videopath: string) => void;
}
