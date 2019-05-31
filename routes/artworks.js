var express = require('express');
var router = express.Router();
var Artwork = require('../models/artwork');
var middleware = require('../middleware');

router.get('/', function(req, res) {
	// get all artwork from artwork db
	Artwork.find({}, function(err, allArtworks) {
		if (err) {
			console.log(err);
		} else {
			res.render('artworks/index', {
				artworks: allArtworks,
				currentUser: req.user,
				page: 'artworks'
			});
		}
	});
});

// create - add new artwork
router.post('/', middleware.isLoggedIn, function(req, res) {
	// get data from form and add to artwork array
	var name = req.body.name;
	var imageURL = req.body.image;
	var description = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newArtwork = { name: name, image: imageURL, description: description, author: author };
	// create a new artwork and save to database
	Artwork.create(newArtwork, function(err, artwork) {
		if (err) {
			console.log(err);
		} else {
			// redirect back to artworks page
			res.redirect('/artworks');
		}
	});
});

router.get('/new', middleware.isLoggedIn, function(req, res) {
	res.render('artworks/new');
});

// RESTful - Show
router.get('/:id', function(req, res) {
	//find the artwork with provided ID
	Artwork.findById(req.params.id).populate('comments').exec(function(err, foundArtwork) {
		if (err || !foundArtwork) {
			req.flash('error', 'Artwork not found');
			res.redirect('back');
		} else {
			res.render('artworks/show', { artwork: foundArtwork });
		}
	});
	//render show template with that artwork
});

// Edit artwork route
router.get('/:id/edit', middleware.checkArtworkOwnership, function(req, res) {
	Artwork.findById(req.params.id, function(err, foundArtwork) {
		res.render('artworks/edit', { artwork: foundArtwork });
	});
});

// Update artwork route
router.put('/:id', middleware.checkArtworkOwnership, function(req, res) {
	// find and update the correct artwork
	Artwork.findByIdAndUpdate(req.params.id, req.body.artwork, function(err, updatedArtwork) {
		if (err) {
			res.redirect('/artworks');
		} else {
			res.redirect('/artworks/' + req.params.id);
		}
	});
	// redirect somewhere(show page)
});

// Destory artwork route
router.delete('/:id', middleware.checkArtworkOwnership, function(req, res) {
	Artwork.findByIdAndRemove(req.params.id, function(err) {
		if (err) {
			res.redirect('/artworks');
		} else {
			req.flash('success', 'Artwork successfully deleted');
			res.redirect('/artworks');
		}
	});
});

module.exports = router;
