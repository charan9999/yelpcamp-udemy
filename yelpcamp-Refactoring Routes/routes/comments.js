var express = require("express");
var router = express.Router({mergeParams: true});

var Campground = require("../models/campground"),
    Comment = require("../models/comment");
// ========================
// COMMENT ROUTES
// ========================

router.get("/new", isLoggenIn, function (req, res) {
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

router.post("/comments", isLoggenIn, function (req, res) {
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


// Middleware to see if the person is authenticated
function isLoggenIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

module.exports = router;