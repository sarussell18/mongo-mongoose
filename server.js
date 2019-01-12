//dependencies
var express = require("express");
var expressHandlebars = require("express-handlebars");
var mongoose = require("mongoose");

//set up port
var PORT = process.env.PORT || 3000;

//initialize express
var app = express();
var router = express.Router();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//require routes
require("./config/routes")(router);

//designate public folder and set up handlebars with express app
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", expressHandlebars({ defaultLayout: "main" }));
app.set("view engine", "handlebars");


app.use(router);

var CONNECTION_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoScraper";

mongoose.connect(CONNECTION_URI, { MONGODB_URI: true }).then(() => {
    console.log('Connected to MongoDB.');
}).catch(err => console.log(err));




//listening on port
app.listen(PORT, function () {
    console.log("Listening on port:" + PORT);
});

