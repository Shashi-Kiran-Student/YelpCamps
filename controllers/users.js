const passport = require('passport');
const User = require('../models/user')


module.exports.logout = async (req, res) => {
    console.log("INFO   /logout - get reached")
    req.logout(msg => {
        req.flash("success", "See you Later")
        res.redirect('/campgrounds')
    })
}
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back!")
    res.redirect('/campgrounds')
}
module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password);
        await req.login(registeredUser, error => {
            if (error) {
                return next(error)
            } else {
                req.flash("success", "Welcome to Yelp Camp!")
                res.redirect('/campgrounds')
            }
        });
    } catch (error) {
        req.flash("error", error.message)
        res.redirect('register')
    }

}