const mongoose = require('mongoose');
const Video = require('./models/video');

mongoose.connect('mongodb://127.0.0.1:27017/video');


// seed our database
Video.collection.drop();

const seedVideos = () => {
    // create some Videos
	const Videos = [
	    {id: 1, comedian: "Judah Friedlander", title: "America is the Greatest Country in the United States", url: "https://www.netflix.com/watch/80208273?trackId=13752289&tctx=0%2C0%2C"},
	    {id: 2, comedian: "Michael Che", title: "Micheal Che Matters", url: "https://www.netflix.com/watch/80049871?trackId=13752289&tctx=0%2C0%2C"},
	    {id: 3, comedian: "Ali Wong", title: "Baby Cobra", url: "https://www.netflix.com/watch/80101493?trackId=13752290&tctx=1%2C1%2C"}
	 ];

	Videos.forEach((video) => {
		var newVideo = Video.create(video);
	});

	console.log('Database seeded!');
}
  
seedVideos();

setTimeout(function () {
  mongoose.connection.close();
}, 5000)

