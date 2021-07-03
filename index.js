const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const GoogleImages = require("google-images");

app.use(cors());

const mongoose = require("mongoose");

// Connect to DB
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
      type: { type: { type: String } },
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
  const fullPath =
    req.query.page > 0 ? req.path + "?page=" + req.query.page : req.path;
  console.log(req.ip + " - " + req.method + "  " + fullPath);
  next();
});

// Loads CSS styles and JS scripts
app.use(express.static(__dirname + "/public"));

// Displays the Image Search Abstraction Layer page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Executes once connected to DB
db.once("open", function () {
  // Finds images and displays the results after submitting a form
  app.post("/query/:query", (req, res) => {
    // Sets up search client
    const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

    // Searches for images using query
    const options = { page: req.body.page, safe: req.body["safe-search"] };
    client.search(req.params.query, options).then((imgs) => {
      res.json(imgs);
    });
  });

  // Finds images via query strings
  app.get("/query/:query", (req, res) => {
    // Sets up search client
    const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

    // Searches for images using query
    const options = { page: req.query.page };
    client.search(req.params.query, options).then((imgs) => {
      res.json(imgs);
    });
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
