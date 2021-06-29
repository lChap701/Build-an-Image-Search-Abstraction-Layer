const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const GoogleImages = require("google-images");

// Formats the IP address
app.listen(process.env.PORT, "0.0.0.0");

app.use(cors());

// Loads CSS styles
app.use(express.static("public/css"));

// Displays the HTML page
app.get("/", (req, res) => {
  // Displays the HTML page
  res.sendFile(__dirname + "/public/index.html");
});

// Sets up search client
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

client.search("Steve Angello").then((images) => {
  console.log(images);
  /*
		[{
			"url": "http://steveangello.com/boss.jpg",
			"type": "image/jpeg",
			"width": 1024,
			"height": 768,
			"size": 102451,
			"thumbnail": {
				"url": "http://steveangello.com/thumbnail.jpg",
				"width": 512,
				"height": 512
			}
		}]
		 */
});

client.search("Steve Angello", { page: 2 });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port + "\n");
});
