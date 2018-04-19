const express = require('express');
const router  = express.Router();
const Video   = require('../models/video');


// gets list of all videos
app.get("/", (req, res) => {
	Video.find(function(err, videos) {
      res.render('videos/index', {videos: videos });
    });
})

// gets video by specific id number
app.get("/:id", (req, res) => {
	let id = req.params.id;

	Video.findOne({id: id}, function(err, video) {
      res.render('videos/show', {video: video });
    });
})

module.exports = router;
