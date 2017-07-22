const request = require('request');
const cheerio = require('cheerio');

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/api/:page', function (req, res) {
        let page = req.params.page;
        if (page == "0") {
            let url = `https://www.reddit.com/r/GifRecipes/`;
            scrapeReddit(res, url);
        } else {
            let url = `https://www.reddit.com/r/GifRecipes/?${page}`;
            scrapeReddit(res, url);
        }
    });

};

let scrapeReddit = (res, url) => {
    let tempArray = [];
    request(url, function (error, response, body) {
        const $ = cheerio.load(body);
        $("div.thing").each((i, element) => {
            let title = $(element).children("div.entry").children("div.top-matter").children("p.title").children().contents().get(0).nodeValue;
            let thumbnail = $(element).children("a").children("img").attr("src");
            let url = $(element).attr("data-url");
            let dataID = $(element).attr("data-fullname");
            if (thumbnail) {
                tempArray.push({
                    "title": title,
                    "thumbnail": thumbnail,
                    "url": url,
                    "id": dataID
                });
            }
        });
        tempObj = {
            "scrape": tempArray
        };
        res.send(tempArray);
    });
};