let mongoose = require("mongoose");
mongoose.Promise = global.Promise;
let Schema = mongoose.Schema;

let NoteSchema = new Schema({
    note: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});

// Create the User model with the UserSchema
let Note = mongoose.model("Note", NoteSchema);

// Export the user model
module.exports = Note;