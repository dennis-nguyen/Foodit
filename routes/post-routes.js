const request = require('request');
const cheerio = require('cheerio');
const Note = require("../models/notes.js");
const Recipe = require("../models/recipes.js");

module.exports = function (app) {
    //Renders Main Page
    app.get('/', function (req, res) {
        res.render('home');
    });
    //Sends Scrape Data
    app.get('/api/:page', function (req, res) {
        let page = req.params.page;
        let category = req.query.category;
        //first scrape
        if (page == "0") {
            let url = `https://www.reddit.com/r/${category}/`;
            scrapeReddit(res, url);
        } else {
            //not first scrape
            let url = `https://www.reddit.com/r/${category}/?${page}`;
            scrapeReddit(res, url);
        }
    });
    //Saves Favorite Recipes
    app.post('/favorite', function (req, res) {
        let newRecipe = new Recipe(req.body);
        newRecipe.save(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                // console.log(doc);
            }
        });
    });
    //Renders Favorite Page
    app.get('/favorite', function (req, res) {
        Recipe.find({}, (error, doc) => {
            res.render('favorite', {
                favorite: doc
            });
        });
    });
    //Database Query - All Favorites
    app.get('/favorite/api', function (req, res) {
        Recipe.find({}, (error, doc) => {
            res.send(doc);
        });
    });
    //Database Query - Notes for single recipe
    app.get('/notes/:id', function (req, res) {
        Recipe.findOne({
            "_id": req.params.id
        }).populate("notes").exec(function (error, doc) {
            if (error) {
                console.log(error);
            } else {
                res.send(doc);
            }
        });
    });
    //Saves Notes
    app.post('/notes/:id', function (req, res) {
        let newNote = new Note(req.body);
        newNote.save(function (err, doc) {
            if (err) {
                console.log(err);
            } else {
                // Find our user and push the new note id into the User's notes array
                Recipe.findOneAndUpdate({
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
                        // console.log(newdoc);
                        res.send(newdoc);
                    }
                });
            }
        });
    });
    //Delete Favorite Recipe Route
    app.delete('/favorite/:id', function (req, res) {
        let favoriteID = req.params.id;
        Recipe.remove({
            _id: favoriteID
        }, (error, doc) => {});
    });
    //Delete Notes Route
    app.delete('/note/:id', function (req, res) {
        let noteID = req.params.id;
        Note.remove({
            _id: noteID
        }, (error, doc) => {});
    });
};
//Scrapes Reddit - only pushes sends recipes that have not been favorited
let scrapeReddit = (res, url) => {
    let tempArray = [];
    let duplicateArray = [];
    //Creates array with recipe reddit IDs from favorite DB
    Recipe.find({}, (error, doc) => {
        doc.forEach((singleFav) => {
            duplicateArray.push(singleFav.redditID);
        });
    });
    //Scrape Function
    request(url, function (error, response, body) {
        const $ = cheerio.load(body);
        $("div.thing").each((i, element) => {
            let title = $(element).children("div.entry").children("div.top-matter").children("p.title").children().contents().get(0).nodeValue;
            let thumbnail = $(element).children("a").children("img").attr("src");
            let url = $(element).attr("data-url");
            let dataID = $(element).attr("data-fullname");
            //If condition - makes sure not already a favorited recipe
            if (thumbnail && duplicateArray.indexOf(dataID) == -1) {
                tempArray.push({
                    "title": title,
                    "thumbnail": thumbnail,
                    "url": url,
                    "id": dataID
                });
            }
        });
        res.send(tempArray);
    });
};