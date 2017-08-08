const mongoose = require('mongoose');
const express = require('express');
const exphbs  = require('express-handlebars');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 8080;
 
// Handlebars
var app = express();
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Public
app.use(express.static("public"));

// Body-Parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.text());
app.use(bodyParser.json({
  type: "application/vnd.api+json"
}));

// Routes
require("./routes/post-routes.js")(app);

// Connection
app.listen(PORT, function (err) {
  if (!err)
    console.log(`Site is live on port: ${PORT}`);
  else console.log(err);
});

// Heroku Mongoose DB Connection
mongoose.connect('mongodb://heroku_lcx22brw:3oi1sphbf6kuc3504h0t6rpkqv@ds115712.mlab.com:15712/heroku_lcx22brw', {useMongoClient: true});

// Local Mongoose DB Connection
// mongoose.connect('mongodb://localhost/my_database');