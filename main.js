const https = require('node:https');
module.exports = {
  regexUrl: (url) => {
    const regex = /^https?:\/\/([a-z]+\.|)tiktok\.com\/([\w]+|\@\D+\w+)/g;
    return url.match(regex);
  },
  getIDVideo: (link) => {
    if (!module.exports.regexUrl(link)) throw 'invalid tiktok url';
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
    const metadata = result.aweme_list?.[0];
    let data = new Object();
    data.dnickname = metadata.author.nickname;
    data.aweme_id = metadata.aweme_id;
    data.author_id = metadata.author.uid;
    data.avatar = metadata.author.avatar_larger.url_list[1];
    data.title = metadata.desc;
    data.url_original = metadata.share_url;
    data.cover = metadata.video?.cover?.url_list.slice(0, -1);
    data.comment = metadata.statistics.comment_count;
    data.download = metadata.statistics.download_count;
    data.play = metadata.statistics.play_count;
    data.share = metadata.statistics.share_count;
    data.collect = metadata.statistics.collect_count;
    data.music_thumbnail = metadata.music.cover_hd.url_list[1];
    data.music = metadata.music.play_url.uri;
    data.video1 = metadata.video?.play_addr?.url_list.slice(0,-2);
    data.video2 = metadata.video?.play_addr?.url_list.slice(-1);
    data.video_wm = metadata.video?.download_addr.url_list.slice(-1);
    return data;
  }
};