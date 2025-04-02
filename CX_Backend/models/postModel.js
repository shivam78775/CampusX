import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    content: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    date: {
        type: Date,
        default: Date.now 
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }],
    postpic: {
        type: String,
        default: "default.png"
    }
})

module.exports = mongoose.model("post", postSchema);