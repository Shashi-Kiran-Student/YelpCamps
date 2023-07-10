const Campground = require('../models/campgrounds');
const handleAsync = require('../Utilities/handleAsync');
const Review = require('../models/reviews');
const{cloudinary}=require('../cloudinary/index');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});

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


module.exports.index = async function (req, res, next) {
    const campgrounds = await Campground.find({});
    res.render('crud/show.ejs', { campgrounds });
}
module.exports.showMore = async function (req, res) {
    const { _id } = req.params;
    const campground = await Campground.findById(_id);
    if (!campground) {
        req.flash('error', 'Sorry, Couldn\'t find that campground');
        return res.redirect('/campgrounds');
    } else {
        await campground.populate({ path: 'reviews', populate: 'author' })
        await campground.populate('author')
        const reviews = campground.reviews;
        res.render('crud/moreinfo.ejs', { campground, reviews });
    }
}
module.exports.createCamp = async function (req, res, next) {
    const geoData = await geocoder.forwardGeocode({
        query:req.body.location,
        limit:1
    }) .send();
    // console.log(req.body);
    // console.log(geoData);
    req.body.geometry = geoData.body.features[0].geometry;
    console.log(geoData.body.features[0].geometry);
    const { title, price, description, location, geometry } = req.body;
    const camp = new Campground({ title: title, price: price, description: description, location: location, author: req.user._id, geometry: geometry});
    camp.images = await req.files.map(f => ({ url: f.path, filename: f.filename }));
    console.log(camp);
    await camp.save();
    req.flash('success', 'Campground created successfully');
    res.redirect('/campgrounds');
}
module.exports.updateInitiate = async function (req, res) {
    const { _id } = req.params;
    const campground = await Campground.findById(_id);
    res.render('crud/edit.ejs', campground);
}
module.exports.deleteInitiate = async function (req, res) {
    const { _id } = req.params;
    const campground = await Campground.findById(_id);
    res.render('crud/delete.ejs', campground);
}
module.exports.update = async function (req, res, next) {
    console.log(req.body);
    const { _id } = req.params;
    const { title, price, location, description } = req.body;
    const camp = await Campground.findByIdAndUpdate(_id, { title, price, location, description });
    let imgs = req.files.map(f => ({ url: f.path,filename:f.filename}))
    camp.images.push(...imgs);
    await camp.save();
    if(req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename)
        }
        await camp.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
    }
    req.flash('success', `${title} updated Successfully`);
    res.redirect(`/campgrounds/${camp._id}`);
}
module.exports.delete = async function (req, res) {
    const { _id } = req.params;
    console.log(`INFO   campgrounds/${_id} - delete reached`)
    await deleteAllReviews(_id)
        .then(msg => {
            Campground.findByIdAndDelete(_id)
        })
        .then(msg => {
            res.redirect('/campgrounds');
        })
        .catch(error => {
            req.flash('error', 'Couldn\'t delete, try again later');
            res.redirect(`/campgrounds/${_id}`);
            console.log(error);
        })
}