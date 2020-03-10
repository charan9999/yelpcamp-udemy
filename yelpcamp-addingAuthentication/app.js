var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");
var PORT = process.env.PORT || 3000;


mongoose.connect("mongodb://localhost:27017/yelp_camp_4", {
    useNewUrlParser: true
});
app.use(bodyParser.urlencoded({
    extended: true
}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "testing the damn secret",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX - Show all campgrounds from db 
app.get("/campgrounds", function (req, res) {
    // get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", {
                campgrounds: allCampgrounds,
                currentUser: req.user
            });
        }
    });

});

// CREATE - send form to add a new campground
app.post("/campgrounds", function (req, res) {

    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {
        name: name,
        image: image,
        description: description
    }
    // create a new campground and save to db
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });

});

// New - show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("campgrounds/new");
});



// Shows more info about one campground
app.get("/campgrounds/:id", function (req, res) {
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            // render show template with that campground
            res.render("campgrounds/show", {
                campground: foundCampground
            });
        }
    });
});

// ========================
// COMMENT ROUTES
// ========================

app.get("/campgrounds/:id/comments/new", isLoggenIn, function (req, res) {
    // find campground by id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", {
                campground: campground
            });
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggenIn, function (req, res) {
    // lookup campground using id
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
            console.log("i fucked u all the way here");
        } else {
            // create new comment
            Comment.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                    console.log("i broke here");
                } else {
                    campground.comments.push(comment);
                    campground.save();

                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });

});

// ========
// AUTH ROUTES
// ========

// show register form
app.get("/register", function (req, res) {
    res.render("register");
});

// handle sign up logic
app.post("/register", function (req, res) {
    var newUser = new User({
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            res.render("register");
        }
        passport.authenticate("Local")(req, res, function () {
            res.redirect("/campgrounds");
        });
    });
});

// show login form
app.get("/login", function (req, res) {
    res.render("login");
});

// handling login logic
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function (req, res) {});

// Logout route
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/campgrounds");
});



function isLoggenIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(PORT, function () {
    console.log(`Server has started ${PORT}`);
});