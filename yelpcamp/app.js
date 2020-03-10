var express = require("express");
var bodyParser = require("body-parser");
var app = express();


var PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
var campgrounds = [{
        name: "Salmon Creek",
        image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/Salmon_Creek.jpg"
    },
    {
        name: "Granite Hill",
        image: "https://thumbs.dreamstime.com/b/eroded-granite-hill-eroded-granite-hill-steppe-mongolia-116286104.jpg"
    },
    {
        name: "Yosemite",
        image: "https://www.nps.gov/yose/planyourvisit/images/20170618_155330.jpg?maxwidth=1200&maxheight=1200&autorotate=false"
    }
]

app.get("/", function (req, res) {
    res.render("landing");
});

app.get("/campgrounds", function (req, res) {
    res.render("campgrounds", {
        campgrounds: campgrounds
    });
});

app.post("/campgrounds", function (req, res) {

    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {
        name: name,
        image: image
    }
    campgrounds.push(newCampground);

    res.redirect("/campgrounds");

});

app.get("/campgrounds/new", function (req, res) {
    res.render("new");
});

app.listen(PORT, function () {
    console.log(`Server has started ${PORT}`);
});