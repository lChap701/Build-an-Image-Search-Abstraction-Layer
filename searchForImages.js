const SearchOptions = require("./searchOptions"); // for JSDoc comment
require("dotenv").config();

// Sets up image searches using my programmable search engine
const GoogleImages = require("google-images");
const client = new GoogleImages(process.env.CSE_ID, process.env.API_KEY);

/**
 * Module for searching for images
 * @module ./searchForImages
 *
 * @param {Response<any, Record<string, any>, number>} res  Represents the respose that should occur
 * @param {String} query    Represents the query to search for
 * @param {SearchOptions} options  Represents search options
 *
 */
module.exports = function searchForImages(res, query, options) {
  // Searches for images using the query and selected options
  client
    .search(query, options)
    .then((imgs) => res.json(imgs))
    .catch((err) => res.send(err));
};
