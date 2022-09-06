# Overview 
The purpose of youtube-apify is make api calls easier to youtube.

# Example 
```ts
const api = new YoutubeAPI();
api.loadSecret('client_secret.json');
api.getNewCode();
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
let code: string;
readline.question(`What's the code`, data => {
  code = data;
  readline.close();
});

api.setCode(code);
api.authorize();
api.uploadVideo(undefined,'my.mp4');
```