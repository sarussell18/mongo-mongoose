var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var Article = require("../models/Article");
var Note = require("../models/Note");

module.exports = function (router) {
    router.get("/", function (req, res) {
        db.Article.find({}).then(function (dbArticles) {
            var articles = {
                dbArticles: dbArticles
            };
            res.render("index", articles);
        }).catch(function (err) {
            console.log(err);
        });
    });

    router.get("/scrape", function (req, res) {
        axios.get("https://techcrunch.com/").then(function (response) {

            var $ = cheerio.load(response.data);

            $(".post-block").each(function (i, element) {

                var result = {};

                result.title = $(element).find(".post-block__title").children().text().trim();
                result.link = $(element).find(".post-block__title").children().attr("href");
                result.summary = $(element).find(".post-block__content").text().trim();

                // Using our Article model, create a new entry
                // This effectively passes the result object to the entry (and the title and link)
                var entry = new Article(result);
                // Now, save that entry to the db
                entry.save(function (err, doc) {
                    // Log any errors
                    if (err) {
                        console.log(err);
                    }
                    // Or log the doc
                    else {
                        console.log(doc);
                    }
                });

            });
            res.redirect('/');
        });

    });

    router.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id }).populate("note").then(function (result) {
            var article = {
                result: result
            };
            res.render("article", article);
        }).catch(function (err) {
            console.log(err);
        });
    });

    router.post("/articles/:id", function (req, res) {
        db.Note.create(req.body).then(function (note) {
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: note._id } }, { new: true })
        }).then(function (result) {
            var article = {
                result: result
            };
            res.render("article", article);
        }).catch(function (err) {
            console.log(err);
        });
    });


    router.delete("/article/:id", function (req, res) {
        db.Note.findByIdAndRemove(req.params.id).then(function (note) {
            console.log(note + " Deleted")
        }).catch(function (err) {
            console.log(err);
        })
    })

};


