const express = require("express");
const app = express();

const cors = require("cors");
require("dotenv").config();

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const GoogleImages = require("google-images");
/*const google = new Scraper({
  puppeteer: {
    headless: true,
  },
});*/

app.use(cors());

// Loads CSS styles
app.use(express.static(__dirname + "/public"));

// Displays the Image Search Abstraction Layer page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Finds images and displays the results
app.post("/query/:query", (req, res) => {
  // Sets up search client
  const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

  // Searches for images using query
  const options = { page: req.body.pages, safe: req.body["safe-search"] };
  client.search(req.params.query, options).then((imgs) => {
    res.json(imgs);
  });
});

// Displays the Google Custom Search Engine page
app.get("/cse", (req, res) => {
  res.sendFile(__dirname + "/public/cse.html");
});

/*(async () => {
  const results = await google.scrape("banana", 200);
  console.log("results", results);
})();*/

const listener = app.listen(process.env.PORT || 8080, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
