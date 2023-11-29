const https = require('node:https');
module.exports = {
  regexUrl: (url) => {
    const regex = /^https?:\/\/([a-z]+\.|)tiktok\.com\/([\w]+|\@\D+\w+)/g;
    return url.match(regex);
  },
  getIDVideo: (link) => {
    if (!module.exports.regexUrl(link)) throw 'url invalid';
    return link.match(/video\/([\d|\+]+)?\/?/)[1];
  },
  getOriginalUrl: (link) => {
    return new Promise((resolve, reject) => {
      const url = new URL(link);
      const options = {
        hostname: url.hostname,
        path: url.pathname,
        method: 'GET',
      };
      const request = https.request(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) return resolve(res.headers.location);
        resolve(link);
      });
      request.on('error',
        reject);
      request.end();
    });
  },
  serializeResult: (data) => {
    
    return data;
  }
};
