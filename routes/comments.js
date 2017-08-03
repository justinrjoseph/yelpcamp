let express = require('express'),
    router = express.Router({ mergeParams: true }),
    { isLoggedIn, validateCommentOwnership } = require('../middleware'),
    Campground = require('../models/campground'),
    Comment = require('../models/comment');

router.get('/new', isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if ( err ) {
			console.log(err.toString());
		} else {
			res.render('comments/new', { campground });
		}
	});
});

router.post('/', isLoggedIn, (req, res) => {
	Campground.findById(req.params.id, (err, campground) => {
		if ( err ) {
			console.log(err.toString());
			redirect('/campgrounds');
		} else {
			let newComment = req.body.comment;

			Comment.create(newComment, (err, comment) => {
				if ( err ) {
          req.flash('error', 'Something went wrong.');
					console.log(err.toString());
				} else {
          comment.author.id = req.user._id;
          comment.author.username = req.user.username;
          comment.save();

					campground.comments.push(comment);
					campground.save();

          req.flash('success', "Comment added successfully.");
					res.redirect(`/campgrounds/${campground._id}`);
				}
			});
		}
	});
});

router.get('/:comment_id/edit', validateCommentOwnership, (req, res) => {
  Comment.findById(req.params.comment_id, (err, comment) => {
    if ( err ) {
      res.redirect('back');
    } else {
      res.render('comments/edit', { campground_id: req.params.id, comment })
    }
  });
});

router.put('/:comment_id', validateCommentOwnership, (req, res) => {
  Comment.findByIdAndUpdate(
    req.params.comment_id,
    req.body.comment,
    (err, comment) => {
      if ( err ) {
        res.redirect('back');
      } else {
        res.redirect(`/campgrounds/${req.params.id}`);
      }
  });
});

router.delete('/:comment_id', validateCommentOwnership, (req, res) => {
  Comment.findByIdAndRemove(req.params.comment_id, (err) => {
    if ( err ) {
      res.redirect('back');
    } else {
      req.flash('success', "Comment deleted.");
      res.redirect(`/campgrounds/${req.params.id}`);
    }
  });
});

module.exports = router;
