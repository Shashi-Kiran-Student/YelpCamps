/////////////////////////////////////////////////////////
///////All The Requirements and Dependencies Are Here////
/////////////////////////////////////////////////////////
const express = require('express');
const Campground = require('../models/campgrounds');
const handleAsync = require('../Utilities/handleAsync');
const expressError = require('../Utilities/expressError');
const Review = require('../models/reviews');
const idealReview = require('../Utilities/Ideals/idealReview');
const router = express.Router({ mergeParams: true });
const isLoggedIn = require('../middlewares/isLoggedIn');
const reviews = require('../controllers/reviews')
/////////////////////////////////////////////////////////
/////////All The Middle Ware Are Here////////////////////
/////////////////////////////////////////////////////////
const isRAuthorized = async function (req, res, next) {
    const { _id, r_id } = req.params
    const review = await Review.findById(r_id);
    if (!(review.author.equals(req.user._id))) {
        req.flash("error", "You do no have permisssion to do that! ");
        res.redirect(`/campgrounds/${_id}`)
    } else {
        next();
    }
}
const validateReview = function (req, res, next) {
    console.log("INFO   Reviewing Review");
    const result = idealReview.validate(req.body);
    if (result.error) {
        let message = result.error.details.map(err => err.message);
        next(new expressError(message, 500));
    }
    else {
        next();
    }
}
/////////////////////////////////////////////////////////
/////////All The GET Routes Are Here/////////////////////
/////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////
/////////All The PATCH Routes Are Here///////////////////
/////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////
/////////All The POST Routes Are Here////////////////////
/////////////////////////////////////////////////////////
router.post('/',
    isLoggedIn,
    validateReview,
    handleAsync(reviews.create)
);

/////////////////////////////////////////////////////////
/////////All The DELETE Routes Are Here//////////////////
/////////////////////////////////////////////////////////
router.delete('/:r_id',
    isLoggedIn,
    isRAuthorized,
    handleAsync(reviews.delete)
)

router.use(function (err, req, res, next) {
    console.log("INFO    Errror Found");
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode)
        .render('error.ejs', { err });
})

module.exports = router