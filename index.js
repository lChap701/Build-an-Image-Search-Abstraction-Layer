/*
 * Created by Lucas Chapman
 *
 * This project was based on https://image-search-abstraction-layer.freecodecamp.rocks/
 * for the purposes of earning a certificate from freeCodeCamp
 */

const SearchOptions = require("./searchOptions");
require("dotenv").config();

const express = require("express");

/**
 * Module that contains the entire application
 * @module ./index
 *
 */
const app = express();

// Setup CORS
const cors = require("cors");
app.use(cors());

// Setup helmet
const helmet = require("helmet");
app.use(helmet.xssFilter());

// Setup body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Bad words filter
const Filter = require("bad-words");
let censor = new Filter();

const searchForImages = require("./searchForImages");
const updateFile = require("./updateFile");

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
let searchSchema = new Schema(
  {
    query: String,
    searchOptions: {
      page: Number,
      imgSize: String,
      imgType: String,
      safe: String,
    },
  },
  { timestamps: true }
);

// Model
const Search = mongoose.model("Searches", searchSchema);

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

// Finds images and displays the results after submitting a form
app.post("/query/:query", (req, res) => {
  if (!req.body.page) {
    res.json({ error: "Page number is required" });
    return;
  }

  // Gets the options that were selected as an object
  const options = new SearchOptions(
    req.body.page,
    req.body.size,
    req.body.type,
    req.body["safe-search"]
  );

  // Searches for images using the query and selected options
  searchForImages(res, req.params.query, options);

  // Saves the search in the DB
  let search = new Search({
    query: req.params.query,
    searchOptions: {
      page: options.page,
      imgSize: options.size,
      imgType: options.type,
      safe: options.safe,
    },
  });

  search.save((err) => {
    if (err) res.send(err);
  });

  // Saves query in JSON file (if it is a new query) and appropriate
  if (!censor.isProfane(req.params.query)) updateFile(req.params.query);
});

// Finds images via query strings
app.get("/query/:query", (req, res) => {
  if (!req.query.page) {
    res.json({ error: "Page number is required" });
    return;
  }

  // Gets the page number that were chosen
  const options = new SearchOptions(req.query.page);

  // Checks if any optional options were specified by looping through an array
  let optional = ["size", "type", "safe"];
  optional.forEach((opt) => {
    if (req.query[opt]) options[opt] = req.query[opt];
  });

  // Searches for images using query and selected options
  searchForImages(res, req.params.query, options);

  // Saves the search in the DB
  let search = new Search({
    query: req.params.query,
    searchOptions: {
      page: options.page,
      imgSize: options.size,
      imgType: options.type,
      safe: options.safe,
    },
  });

  search.save((err) => {
    if (err) res.send(err);
  });

  // Saves query in JSON file (if it is a new query) and appropriate
  if (!censor.isProfane(req.params.query)) updateFile(req.params.query);
});

// Displays the most recent searches
app.get("/recent/", (req, res) => {
  let src = [];

  Search.find({}, (err, search) => {
    if (err) {
      res.send(err);
    } else {
      src = search.map((s) => {
        return {
          query: s.query,
          searchOptions: s.searchOptions,
        };
      });

      res.json(src);
    }
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

module.exports = app; // For testing
