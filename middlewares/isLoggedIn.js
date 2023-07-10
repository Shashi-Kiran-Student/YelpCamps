const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be signed in first");
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnToUrl = (req, res, next) => {
    if(req.session.returnToUrl) {
        res.locals.returnToUrl = req.session.returnToUrl
    }
    next();
}
module.exports = isLoggedIn