let express = require('express'),
    router = express.Router(),
    { isLoggedIn, validateCampgroundOwnership } = require('../middleware'),
    Campground = require('../models/campground');

router.get('/', (req, res) => {
	Campground.find({}, (err, campgrounds) => {
		if ( err ) {
			console.log(err.toString());
		} else {
			res.render('campgrounds/index', { campgrounds });
		}
	});
});

router.get('/new', isLoggedIn, (req, res) => {
	res.render('campgrounds/new');
});

router.post('/', isLoggedIn, (req, res) => {
  let author = {
    id: req.user._id,
    username: req.user.username
  };

  let newCampground = Object.assign(req.body.campground, { author });

	Campground.create(newCampground, (err, campground) => {
		if ( err ) {
			console.log(err.toString());
		} else {
			res.redirect('campgrounds');
		}
	});
});

router.get('/:id', (req, res) => {
	Campground.findById(req.params.id)
		.populate('comments')
		.exec((err, campground) => {
			if ( err ) {
				console.log(err.toString());
			} else {
				res.render('campgrounds/show', { campground });
			}
	});
});

router.get('/:id/edit', validateCampgroundOwnership, (req, res) => {
  Campground.findById(req.params.id, (err, campground) => {
    res.render('campgrounds/edit', { campground });
  });
});

router.put('/:id', validateCampgroundOwnership, (req, res) => {
  Campground.findByIdAndUpdate(
    req.params.id,
    req.body.campground,
    (err, campground) => {
      if ( err ) {
        res.redirect('/campgrounds');
      } else {
        res.redirect(`/campgrounds/${campground._id}`);
      }
  });
});

router.delete('/:id', validateCampgroundOwnership, (req, res) => {
  Campground.findByIdAndRemove(req.params.id, (err) => {
    res.redirect('/campgrounds');
  });
});

module.exports = router;
