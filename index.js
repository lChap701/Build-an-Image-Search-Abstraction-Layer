/*
 * Created by Lucas Chapman
 *
 * This project was on https://image-search-abstraction-layer.freecodecamp.rocks/
 * for the purposes of earning a certificate from freeCodeCamp
 */

const SearchOptions = require("./searchOptions");
require("dotenv").config();

const express = require("express");
const app = express();

// Setup CORS
const cors = require("cors");
app.use(cors());

// Set up body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Sets up image searches using my programmable search engine
const GoogleImages = require("google-images");
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

// Connect to DB
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

// Displays connection errors
db.on("error", console.error.bind(console, "connection error:"));

// Schema
const Schema = mongoose.Schema;
let imageSchema = new Schema({
  query: String,
  images: [
    {
      type: String,
      width: Number,
      height: Number,
      size: Number,
      url: String,
      thumbnail: {
        url: String,
        width: Number,
        height: Number,
      },
      description: String,
      parentPage: String,
    },
  ],
  page: Number,
  safe: String,
});

// Model
const Image = mongoose.model("Images", imageSchema);

// Formats the IP Address
app.listen(process.env.PORT, "0.0.0.0");

// Logs requests and other information
app.use(function middleware(req, res, next) {
  // Gets the full query string
  let query = "?";
  let keys = Object.keys(req.query);
  let last = keys[keys.length - 1];

  if (keys.length > 1) {
    keys.forEach((k) => {
      query +=
        k == last ? k + "=" + req.query[k] : k + "=" + req.query[k] + "&";
    });
  } else {
    query += "page=" + req.query.page;
  }

  // Gets the full path
  const fullPath = keys.length !== 0 ? req.path + query : req.path;

  console.log(req.ip + " - " + req.method + "  " + fullPath);
  next();
});

// Allows stylesheets, JS scripts, and other files to be loaded
app.use(express.static(__dirname + "/public"));

// Displays the Image Search Abstraction Layer page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Executes once connected to DB
db.once("open", function () {
  // Finds images and displays the results after submitting a form
  app.post("/query/:query", (req, res) => {
    // Gets the options that were selected as an object
    const options = new SearchOptions(
      req.body.page,
      req.body.size,
      req.body.type,
      req.body["safe-search"]
    );

    // Searches for images using the query and selected options
    client
      .search(req.params.query, options)
      .then((imgs) => {
        res.json(imgs);
      })
      .catch((err) => console.log(err));
  });

  // Finds images via query strings
  app.get("/query/:query", (req, res) => {
    // Gets the page number that were chosen
    const options = new SearchOptions(req.query.page);

    // Checks if any optional options were specified by looping through an array
    let optional = ["size", "type", "safe"];
    optional.forEach((opt) => {
      if (req.query[opt]) {
        options[opt] = req.query[opt];
      }
    });

    // Searches for images using query and selected options
    client
      .search(req.params.query, options)
      .then((imgs) => {
        res.json(imgs);
      })
      .catch((err) => console.log(err));
  });

  // Displays the most recent searches
  app.get("/recent/", (req, res) => {
    res.send("You made it!");
  });
});

// Displays the Google Custom Search Engine page
app.get("/cse/", (req, res) => {
  res.sendFile(__dirname + "/public/cse.html");
});

// Sets the port used to access my app
const listener = app.listen(process.env.PORT || 8080, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
