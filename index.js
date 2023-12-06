const axios = require('axios');
const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const { getIDVideo, getOriginalUrl, serializeResult } = require(path.join(__dirname, '.','main'));
const app = express();

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
     res.render('/index');
  })

app.get('/url',async (req, res) => {
    const text = req.query.link
    if(!text) return res.status(404)
    let link = await getOriginalUrl(text)
    let id = getIDVideo(link)
    let { data } = await axios.get(`https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`);
    const result = serializeResult(data);
    const URL = `https://tt.rickk.biz.id/download?url=${text}`
       res.render('/index1', {
         datas : result.video,
         music : result.music,
         title : result.title,
         play : result.play,
         like : result.like,
         comment : result.comment,
         share : result.share
     })
}) 

app.listen(3000, () => console.log('Server started 3000'));
