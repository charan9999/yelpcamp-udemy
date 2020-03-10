var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var PORT = process.env.PORT || 3000;


seedDB();
mongoose.connect("mongodb://localhost:27017/yelp_camp_2", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({
    extended: true
}));





app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.render("landing");
});

// INDEX - Show all campgrounds from db 
app.get("/campgrounds", function (req, res) {
    // get all campgrounds from DB
    Campground.find({}, function(err,allCampgrounds){
        if(err){
            console.log(err);
        }else{
            res.render("index",{campgrounds:allCampgrounds});
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
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            // redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });

});

// New - show form to create new campground
app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});



// Shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            console.log(foundCampground);
            // render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(PORT, function () {
    console.log(`Server has started ${PORT}`);
});