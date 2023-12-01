const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb://localhost/url-shortener', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  shortUrl: String,
  longUrl: String,
});

const Url = mongoose.model('Url', urlSchema);

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  const shortUrl = shortid.generate();

  const newUrl = new Url({
    shortUrl,
    longUrl,
  });

  await newUrl.save();

  res.json({ shortUrl });
});

app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const url = await Url.findOne({ shortUrl });

  if (url) {
    res.redirect(url.longUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
