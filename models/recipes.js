let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let Schema = mongoose.Schema;

let RecipeSchema = new Schema({
    title: {
        type: String
    },
    url: {
        type: String
    },
    thumbnail: {
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
let Recipe = mongoose.model("Recipe", RecipeSchema);

// Export the user model
module.exports = Recipe;