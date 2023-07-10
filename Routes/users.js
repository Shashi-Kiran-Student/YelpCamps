/////////////////////////////////////////////////////////
///////All The Requirements and Dependencies Are Here////
/////////////////////////////////////////////////////////
const express = require('express');
const User = require('../models/user');
const handleAsync = require('../Utilities/handleAsync')
const passport = require('passport');
const isLoggedIn = require('../middlewares/isLoggedIn');
const users = require('../controllers/users')

/////////////////////////////////////////////////////////
/////////All The Middle Ware Are Here////////////////////
/////////////////////////////////////////////////////////
const router = express.Router();

/////////////////////////////////////////////////////////
/////////All The Junction Routes Are Here////////////////
/////////////////////////////////////////////////////////
router.route('/register')
    .get((req, res) => {
        res.render('users/register')
    })
    .post(handleAsync(users.register))

router.route('/login')
    .get(handleAsync(
        async (req, res) => {
            res.render('users/login')
        }
    ))
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
        handleAsync(users.login)
    )

/////////////////////////////////////////////////////////
/////////All The Individual Routes Are Here//////////////
/////////////////////////////////////////////////////////
router.get('/logout',
    isLoggedIn,
    handleAsync(users.logout)
)

module.exports = router;