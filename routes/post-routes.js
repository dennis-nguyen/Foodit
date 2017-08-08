const request = require('request');
const cheerio = require('cheerio');
const Note = require("../models/notes.js");
const Gif = require("../models/Gifs.js");

module.exports = function (app) {
    // Renders Main Page
    app.get('/', function (req, res) {
        res.render('home');
    });
    // Sends Scrape Data
    app.get('/api/:page', function (req, res) {
        let page = req.params.page;
        let category = req.query.category;
        // First Scrape
        if (page == "0") {
            let url = `https://www.reddit.com/r/${category}/`;
            scrapeReddit(res, url);
        } else {
            // Not First Scrape
            let url = `https://www.reddit.com/r/${category}/?${page}`;
            scrapeReddit(res, url);
        }
    });
    // Saves Favorite Gifs
    app.post('/favorite', function (req, res) {
        let newGif = new Gif(req.body);
        newGif.save(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                // console.log(doc);
            }
        });
    });
    // Renders Favorite Page
    app.get('/favorite', function (req, res) {
        Gif.find({}, (error, doc) => {
            res.render('favorite', {
                favorite: doc
            });
        });
    });
    // Database Query - All Favorites
    app.get('/favorite/api', function (req, res) {
        Gif.find({}, (error, doc) => {
            res.send(doc);
        });
    });
    // Database Query - Notes for single gif
    app.get('/notes/:id', function (req, res) {
        Gif.findOne({
            "_id": req.params.id
        }).populate("notes").exec(function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.send(doc);
            }
        });
    });
    // Saves Notes
    app.post('/notes/:id', function (req, res) {
        let newNote = new Note(req.body);
        newNote.save(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                // Find our user and push the new note id into the User's notes array
                Gif.findOneAndUpdate({
                    "_id": req.params.id
                }, {
                    $push: {
                        "notes": doc._id
                    }
                }, {
                    new: true
                }, function (err, newdoc) {
                    // Send any errors to the browser
                    if (err) {
                        res.send(err);
                    }
                    // Or send the newdoc to the browser
                    else {
                        res.send(newdoc);
                    }
                });
            }
        });
    });
    // Delete Favorite Gif Route
    app.delete('/favorite/:id', function (req, res) {
        let favoriteID = req.params.id;
        Gif.remove({
            _id: favoriteID
        }, (error, doc) => {});
    });
    // Delete Notes Route
    app.delete('/note/:id', function (req, res) {
        let noteID = req.params.id;
        Note.remove({
            _id: noteID
        }, (error, doc) => {});
    });
};
// Scrapes Reddit - only pushes sends gifs that have not been favorited
let scrapeReddit = (res, url) => {
    let tempArray = [];
    let duplicateArray = [];
    // Creates array with gifs reddit IDs from favorite DB
    Gif.find({}, (error, doc) => {
        doc.forEach((singleFav) => {
            duplicateArray.push(singleFav.redditID);
        });
    });
    // Scrape Function
    request(url, function (error, response, body) {
        const $ = cheerio.load(body);
        $("div.thing").each((i, element) => {
            let title = $(element).children("div.entry").children("div.top-matter").children("p.title").children().contents().get(0).nodeValue;
            let thumbnail = $(element).children("a").children("img").attr("src");
            let url = $(element).attr("data-url");
            let dataID = $(element).attr("data-fullname");
            let urlComments = $(element).children("div.entry").children("div.top-matter").children("ul.flat-list").children("li.first").children().attr("href");
            // Conditional - makes sure not already a favorited gif & that it links directly to a gif
            let urlSplit = url.split(".");
            let lastUrlIndex = (urlSplit[urlSplit.length-1]);
            if (thumbnail && (duplicateArray.indexOf(dataID) == -1) && (lastUrlIndex == "gif" || lastUrlIndex == "gifv")) {
                tempArray.push({
                    "title": title,
                    "thumbnail": thumbnail,
                    "url": url,
                    "id": dataID,
                    "urlComments": urlComments
                });
            }
        });
        res.send(tempArray);
    });
};