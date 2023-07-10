const Campground = require('../models/campgrounds')
const Review = require('../models/reviews')

module.exports.create = async function (req, res, next) {
    const { _id } = req.params;
    const camp = await Campground.findById(_id);
    const { rating, body } = req.body;
    const review = await new Review({ rating: rating, body: body, author: req.user._id }).save();
    camp.reviews.push(review);
    await camp.save();
    req.flash('success', 'review added');
    res.redirect(`/campgrounds/${_id}`);
}
module.exports.delete = async function (req, res) {
    const { _id, r_id } = req.params;
    await Campground.findByIdAndUpdate(_id, { $pull: { reviews: r_id } });
    await Review.findByIdAndDelete(r_id);
    req.flash('success', 'Review deleted');
    res.redirect(`/campgrounds/${_id}`);
}