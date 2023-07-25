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
  serializeResult: (result) => {
    const metadata = result.aweme_list?.[0];
    nickname = metadata.author.nickname;
    aweme_id = metadata.aweme_id;
    author_id = metadata.author.uid;
    avatar = metadata.author.avatar_larger.url_list[1];
    title = metadata.desc;
    url_original = metadata.share_url;
    cover = metadata.video?.cover?.url_list.slice(0, -1);
    comment = metadata.statistics.comment_count;
    download = metadata.statistics.download_count;
    play = metadata.statistics.play_count;
    share = metadata.statistics.share_count;
    collect = metadata.statistics.collect_count;
    music_thumbnail = metadata.music.cover_hd.url_list[1];
    music = metadata.music.play_url.uri;
    video1 = metadata.video?.play_addr?.url_list.slice(0,-2);
    video2 = metadata.video?.play_addr?.url_list.slice(-1);
    video_wm = metadata.video?.download_addr.url_list.slice(-1);
    return data;
  }
};