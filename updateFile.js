require("dotenv").config();
const fs = require("fs");
const FILE = __dirname + "/public/json/terms.json";
const ENCODING = "utf8";

/**
 * Module for adding new queries to a JSON file of queries
 * @module ./updateFile
 * @param {String} query    Represents the search query
 *
 */
module.exports = function updateFile(query) {
  fs.readFile(FILE, ENCODING, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let duplicate = false;
      const obj = JSON.parse(data);

      // Looks for duplicates
      obj.terms.forEach((t) => {
        if (t.term == query) {
          duplicate = true;
        }
      });

      // Checks if the query is already included
      if (!duplicate) {
        // Adds query to JSON data
        obj.terms.push({ term: query });

        // Appends JSON to the file
        const json = JSON.stringify(obj);
        fs.writeFile(FILE, json, ENCODING, (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    }
  });
};
