var express = require('express');
var router = express.Router({ mergeParams: true });
var Artwork = require('../models/artwork');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// ===============
// Comment route
// ===============

// Comment New
router.get('/new', middleware.isLoggedIn, function(req, res) {
	Artwork.findById(req.params.id, function(err, artwork) {
		if (err) {
			console.log(err);
		} else {
			res.render('comments/new', { artwork: artwork });
		}
	});
});

// Comment Create
router.post('/', middleware.isLoggedIn, function(req, res) {
	// look up artwork using id
	Artwork.findById(req.params.id, function(err, artwork) {
		if (err) {
			console.log(err);
		} else {
			Comment.create(req.body.comment, function(err, comment) {
				if (err) {
					req.flash('error', "This shouldn't happen. Please contact the support.");
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					artwork.comments.push(comment);
					artwork.save();
					req.flash('success', 'Successfully added comment');
					res.redirect('/artworks/' + artwork._id);
				}
			});
		}
	});
	// create new comment
	// connect new comment to artwork
	// redirect artwork show page
});

// Edit Comment Route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res) {
	Artwork.findById(req.params.id, function(err, foundArtwork) {
		if (err || !foundArtwork) {
			req.flash('error', 'Artwork not found');
			return res.redirect('back');
		}
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) {
				req.flash('error', "This shouldn't happen. Please contact the support.");
				res.redirect('back');
			} else {
				res.render('comments/edit', { artwork_id: req.params.id, comment: foundComment });
			}
		});
	});
});

// Update Comment Route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment) {
		if (err) {
			res.redirect('back');
		} else {
			res.redirect('/artworks/' + req.params.id);
		}
	});
});

// Delete comment route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res) {
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect('back');
		} else {
			req.flash('success', 'Comment deleted');
			res.redirect('/artworks/' + req.params.id);
		}
	});
});

module.exports = router;
