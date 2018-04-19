const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    comedian: { type: String, required: true },
    title: String,
    url: String,
    id: Number
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;