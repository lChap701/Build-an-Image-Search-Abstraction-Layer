const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const GoogleImages = require("google-images");

app.use(cors());

// Loads CSS styles
app.use(express.static(__dirname + "/public"));

// Displays the HTML page
app.get("/", (req, res) => {
  // Displays the HTML page
  res.sendFile(__dirname + "/public/index.html");
});

// Sets up search client
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

client.search("Steve Angello").then((images) => {
  console.log(images);
});

client.search("Steve Angello", { page: 2 });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(
    "Your app is listening on port " + listener.address().port + "\n"
  );
});
