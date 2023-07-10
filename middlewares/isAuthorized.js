const Campground = require('../models/campgrounds')

module.exports = async function (req, res, next) {
    let camp = await Campground.findById(req.params._id)
    if (!camp.author.equals(req.user._id)) {
        console.log(`FAIL   couldn't perform task on  ${req.params._id}`)
        req.flash('error', 'You are not authorised to perform this action')
        res.redirect(`/campgrounds`)
    } else {
        next();
    }
}