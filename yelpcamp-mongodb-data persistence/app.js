var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");

var PORT = process.env.PORT || 3000;

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({
    extended: true
}));



// schema setup

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});


var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create({
//     name: "Salmon Creek",
//     image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Salmon_Creek.jpg",
//     description: "This is a usage salmon creek literally"
// }, function (err, campground) {
//     if (err) {
//         console.log(err);
//     } else {
//         console.log("yah");
//         console.log(campground);
//     }
// });

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
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            
            res.render("show", {campground: foundCampground});
        }
    });
});

app.listen(PORT, function () {
    console.log(`Server has started ${PORT}`);
});