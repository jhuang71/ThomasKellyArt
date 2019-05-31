// all the middleware goes here
var middlewareObject = {};
var Artwork = require('../models/artwork');
var Comment = require('../models/comment');

middlewareObject.checkArtworkOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Artwork.findById(req.params.id, function(err, foundArtwork) {
			if (err || !foundArtwork) {
				req.flash('error', 'Artwork not found');
				res.redirect('back');
			} else {
				// does user own the artwork?
				if (foundArtwork.author.id.equals(req.user._id)) {
					next();
				} else {
					res.flash('error', "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to log in first!');
		res.redirect('back');
	}
};

middlewareObject.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err || !foundComment) {
				req.flash('error', 'Comment not found');
				res.redirect('back');
			} else {
				// does user own the comment?
				if (foundComment.author.id.equals(req.user._id)) {
					next();
				} else {
					res.flash('error', "You don't have permission to do that");
					res.redirect('back');
				}
			}
		});
	} else {
		req.flash('error', 'You need to log in first!');
		res.redirect('back');
	}
};

middlewareObject.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash('error', 'Please Login First!');
	res.redirect('/login');
};

// middlewareObject contains all the middleware
module.exports = middlewareObject;
