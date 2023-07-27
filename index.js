const axios = require('axios');
const express = require('express');
const path = require('node:path');
const fs = require('node:fs');
const { getIDVideo, getOriginalUrl, serializeResult } = require(path.join(__dirname, '.','main'));
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) =>{
   res.json({message: 'hallo bang hehe :v'});
});
app.get('/download', async (req, res) => {
   const url = req.query.url
   if(!url) return res.status(400).json({ error: 'Not Found Url!' })
   try {
      let link = await getOriginalUrl(url)
      let id = getIDVideo(link)
      const start = (new Date()).getTime();
      let { data } = await axios.get(`https://api16-normal-c-useast1a.tiktokv.com/aweme/v1/feed/?aweme_id=${id}`);
      const result = serializeResult(data);
      const end = (new Date()).getTime()
      res.json({
      time: `${end - start} ms`,
      type: 'application/json',
      result
      });
   } catch (e) {
   res.status(400).json({ error : e })
      console.log(e)
   }
})
app.listen(3000, () => console.log('Server started 3000'));
