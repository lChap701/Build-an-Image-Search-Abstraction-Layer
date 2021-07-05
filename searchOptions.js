/**
 * Module for creating objects using the options that were chosen
 * @module ./searchOptions
 * 
 */
module.exports = class SearchOptions {
  constructor(
    pg,
    sz = "imgSizeUndefined",
    tp = "imgTypeUndefined",
    sf = "off"
  ) {
    this.page = pg;
    this.size = sz;
    this.type = tp;
    this.safe = sf;
  }
};
