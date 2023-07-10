/////////////////////////////////////////////////////////
///////All The Requirements and Dependencies Are Here////
/////////////////////////////////////////////////////////
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');
const handleAsync = require('../Utilities/handleAsync');
const expressError = require('../Utilities/expressError');
const idealCamp = require('../Utilities/Ideals/idealCamp');
const isLoggedIn = require('../middlewares/isLoggedIn')
const isAuthorized = require('../middlewares/isAuthorized');
const campgrounds = require('../controllers/campgrounds')
const { storage } = require('../cloudinary/index')

const multer = require('multer')
const upload = multer({ storage });

const app=express()
app.use(express.urlencoded({ extended: true })); //use to read data from req.body of a form

/////////////////////////////////////////////////////////
/////////All The Middle Ware Are Here////////////////////
/////////////////////////////////////////////////////////
const validateCamp = function (req, res, next) {
    console.log("INFO    Validating camp");
    const result = idealCamp.validate(req.body);
    if (result.error) {
        let message = result.error.details.map(err => err.message);
        next(new expressError(message, 500));
    }
    else {
        next();
    }
};
const deleteAllReviews = async function (campId) {
    console.log("INFO   Deleting all related Reviews");
    const camp = await Campground.findById(campId);
    for (let review of camp.reviews) {
        await Review.findByIdAndDelete(review);
    }
    console.log("INFO   PASS    All reviews deleted");
    await Campground.deleteOne({ _id: campId });
    console.log("INFO   PASS    CampgroundDeleted");
}
/////////////////////////////////////////////////////////
/////////All The Routes Go Here /////////////////////////
/////////////////////////////////////////////////////////
router.get('/:_id/delete',
    isLoggedIn,
    handleAsync(campgrounds.deleteInitiate)
);
router.get('/:_id/edit',
    isLoggedIn,
    handleAsync(campgrounds.updateInitiate)
);
router.get('/new', isLoggedIn,
    handleAsync(
        async function (req, res) {
            res.render('crud/create.ejs')
        }
    )
);
/////////////////////////////////////////////////////////
/////////All The Dynamic Routes Go Here /////////////////
/////////////////////////////////////////////////////////
router.route('/:_id')
    .get(handleAsync(campgrounds.showMore))
    .patch(isLoggedIn,
        isAuthorized,
        upload.array('images'),
        validateCamp,
        handleAsync(campgrounds.update)
    )
    .delete(isLoggedIn,
        isAuthorized,
        handleAsync(campgrounds.delete)
    )
router.route('/')
    .get(handleAsync(campgrounds.index))
    .post(isLoggedIn,
        upload.array('images'),
        validateCamp,
        handleAsync(campgrounds.createCamp)
    );
// .post(upload.single('image'),
//     (req, res) => {
//         console.log(req.body, req.file)
//         res.redirect('/campgrounds');
//     })



//error handling middleware
router.use(function (err, req, res, next) {
    console.log("INFO    Errror Found");
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode)
        .render('error.ejs', { err });
})



module.exports = router;