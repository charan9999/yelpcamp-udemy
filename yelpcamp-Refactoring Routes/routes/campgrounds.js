var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
// INDEX - Show all campgrounds from db 
router.get("/", function (req, res) {
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
router.post("/", function (req, res) {

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
router.get("/new", function (req, res) {
    res.render("campgrounds/new");
});

// Shows more info about one campground
router.get("/:id", function (req, res) {
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


module.exports = router;