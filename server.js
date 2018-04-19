const express    = require('express');
const morgan     = require('morgan');
const path       = require("path");
const mongoose   = require('mongoose');
const bcrypt     = require('bcrypt');
const bodyParser = require('body-parser');
const session    =  require('express-session');


const User       = require('./models/user');


mongoose.connect('mongodb://127.0.0.1:27017/video');
if (process.env.NODE_ENV == "production") {
  mongoose.connect(process.env.MLAB_URL)
} else {
  mongoose.connect("mongodb://localhost/whenpresident");
}


const app = express();
const saltRounds = 10;

const router = express.Router();
const videos = require('./routes/videos');
app.use('/videos', videos);


app.use(morgan('tiny'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded());
app.use(bodyParser.json())
app.use(session({
  secret: 'our secret cat',
  resave: false,
  saveUninitialized: true
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.post('/signup', (req, res) => {
  let username = req.body.username;

  // hash the password
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // save the password digest (hash) to the user
	let user = new User({username: username, passwordDigest: hash});
	user.save().then(() => {
		console.log("New user created!", username);
		req.session.user = user;
		res.redirect('/videos')
	})
  });
});

app.post('/login', (req, res) => {
	console.log(req.body);
	let username = req.body.username;
	let enteredPassword = req.body.password;

	User.findOne({username: username}, function(err, user) {
		if(user) {
			bcrypt.compare(enteredPassword, user.passwordDigest, (err, result) => {
				if(err) {
					console.log("Incorrect password!");
				};
				if(result) {
					console.log("Logged in!");
					req.session.user = user;
					res.redirect('/videos');
				}
			})
		};
		if(err){
			console.log(err);
			res.redirect('/videos');
		}
    });

});

app.get('/logout', (req,res) => {
	console.log(req.session)
	req.session.user = null;
	res.redirect('/videos')
})

app.get("/protected", (req, res) => {
	console.log(req.session)
	if(!req.session.user ) {
		return res.status(401).send("Sorry, not allowed");
	} else {
		return res.status(200).send("Welcome to the protected area!")
	}
});

// update tweet by specific user
app.put('/users/:id/tweets/:tweet_id', (req, res) => {
  let newTweetData = req.body;
  Tweet.findByIdAndUpdate(req.params.tweet_id, newUserData, null, () {
    res.redirect('/users/' + req.params.id + '/tweets' + 'req.params.tweet_id');
  })
})

// delete tweet by id
app.delete('/users/:id/tweets/:tweet_id', function(req, res) {
  Tweet.findByIdAndRemove(req.params.tweet_id);
  res.send('Your tweet ' + req.params.tweet_id + " has been removed");
})



app.get("/helloworld", (req, res) => {
	let data = {
	    message: 'Hello World!',
	    documentTitle: 'Comedy Videos!!',
	    subTitle: 'Read some of the coolest comedy videos around.',
	    currentUser: false,
        comedians: ['John Mulaney', 'Michael Che', 'Maria Bamford'],
	  }
	res.render('index', data);
});

app.listen(3000, () => {
    console.log("I am listening");
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
