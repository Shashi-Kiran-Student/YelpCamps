/////////////////////////////////////////////////////////
///////All The Requirements and Dependencies Are Here////
/////////////////////////////////////////////////////////
const express = require('express')
const mongoose = require('mongoose');
const ejs = require('ejs');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const expressError = require('./Utilities/expressError');
const campRoutes = require('./Routes/campgrounds');
const reviewRoutes = require('./Routes/reviews');
const session = require('express-session');
const MongoStore = require('connect-mongo')
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('./models/user');
const userRoutes = require('./Routes/users');
/////////////////////////////////////////////////////////
/////////All The Middle Ware Are Here////////////////////
/////////////////////////////////////////////////////////
// const dbUrl = process.env.DB_ACCESS_URL;

const app = express();
app.use(mongoSanitize());
app.engine('ejs', ejsMate);


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


/////////////////////////////////////////////////////////
///////////////////////MONGO to MONGOOSE/////////////////
/////////////////////////////////////////////////////////
const dbUrl = 'mongodb://127.0.0.1:27017/campgrounds'
mongoose.connect(dbUrl)
    .then(msg => {
        console.log('PASS    Connected To Database')
    })
    .catch(error => {
        console.log('FAIL    Something went wrong');
        console.log(error)
    })

// Setting up Sessions
const store = new MongoStore({
        mongoUrl: dbUrl,
        secret: 'ThisshouldBeSsecret',
        touchAfter: 3600*24
    })
//Checking if the store creation has any error
store.on("error", function(error){
    console.log("FAIL   Store creation unsuccessful")
    console.log(error)
})
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
app.use(session({
    secret: 'This is a secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store : store
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
});
app.use(methodOverride('_method')); // used to override post requests into put/patch/delete 
app.use(express.urlencoded({ extended: true })); //use to read data from req.body of a form
app.use(express.json());


app.use('/campgrounds/:_id/reviews', reviewRoutes); //routes concerned with reviews
app.use('/campgrounds', campRoutes); //routes concerned with reviews
app.use('/', userRoutes);




//home page
app.use('/home', async function (req, res) {
    res.render('home.ejs');
})

//unknown route
app.all('*', function (req, res, next) {
    console.log('INFO   Searching for unkown page');
    next(new expressError('Page Not Found', 404));
})

//Error handling Middleware
app.use(function (err, req, res, next) {
    console.log("INFO   Errror Found");
    const { statusCode = 500, message = 'Something went wrong' } = err;
    res.status(statusCode)
        .render('error.ejs', { err });
})


/////////////////////////////////////////////////////////
//////////////////////HOSTING from localhost/////////////
/////////////////////////////////////////////////////////
app.listen(3000, function () {
    console.log('PASS    Server Listening on port 3000')
});