let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let Schema = mongoose.Schema;

let GifSchema = new Schema({
    title: {
        type: String
    },
    url: {
        type: String
    },
    thumbnail: {
        type: String
    },
    urlComments: {
        type: String
    },
    redditID: {
        type: String
    },
    notes: [{
        type: Schema.Types.ObjectId,
        ref: "Note"
    }]
});

// Create the User model with the UserSchema
let Gif = mongoose.model("Gif", GifSchema);

// Export the user model
module.exports = Gif;