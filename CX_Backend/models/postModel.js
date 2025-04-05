const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        text: String,
        date: { type: Date, default: Date.now }
    }],
    postpic: {
        type: String,
    }
});

module.exports = mongoose.model("Post", postSchema);
