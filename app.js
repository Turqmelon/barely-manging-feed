const express = require('express');
const RSSParser = require('rss-parser');
const rateLimit = require('express-rate-limit');

const FEED_URL = 'https://anchor.fm/s/cd70238/podcast/rss';

const app = express();

const parser = new RSSParser();

const feedRateLimit = rateLimit({
    windowMs: 3*1000,
    max: 3,
    error: {
        message: 'Too many requests. Try again shortly.'
    }
});
app.get('/feed', feedRateLimit, async (req, res) => {
    try {
        const feed = await parser.parseURL(FEED_URL);
        res.status(200).send(feed.items);
    }catch (e) {
        console.log(e);
        res.status(500).send({
            error: e.message
        });
    }
});

app.set('port', 3000);

app.listen(app.get('port'));