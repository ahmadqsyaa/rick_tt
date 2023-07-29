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
    const metadata = data.aweme_list?.[0];
    let result = new Object();
    result.nickname = metadata.author.nickname;
     result.aweme_id = metadata.aweme_id;
     result.author_id = metadata.author.uid;
     result.avatar = metadata.author.avatar_larger.url_list[1];
     result.title = metadata.desc;
     result.url_asli = metadata.share_url;
     result.cover = metadata.video?.cover?.url_list[0];
     result.comment = metadata.statistics.comment_count;
     result.download = metadata.statistics.download_count;
     result.play = metadata.statistics.play_count;
     result.share = metadata.statistics.share_count;
     result.collect = metadata.statistics.collect_count;
     result.music_thumbnail = metadata.music.cover_hd.url_list[1];
     result.music = metadata.music.play_url.uri;
     result.video = metadata.video?.play_addr?.url_list;
     result.video_wm = metadata.video?.download_addr.url_list;
    return result;
  }
};