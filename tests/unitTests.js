// Chai Setup
const chai = require("chai");
const assert = chai.assert;

const SearchOptions = require("../searchOptions");

suite("Unit Tests", () => {
  suite("SearchOptions Class Tests", () => {
    test("1)  Default Data Test", () => {
      let srcOpts = new SearchOptions();
      assert.propertyVal(srcOpts, "page", undefined);
      assert.propertyVal(srcOpts, "size", "imgSizeUndefined");
      assert.propertyVal(srcOpts, "type", "imgTypeUndefined");
      assert.propertyVal(srcOpts, "type", "imgTypeUndefined");
      assert.propertyVal(srcOpts, "safe", "off");
    });

    test("2)  Page Property Test", () => {
      let srcOpts = new SearchOptions(1);
      assert.propertyVal(srcOpts, "page", 1);
    });

    test("3)  All Properties Test", () => {
      let srcOpts = new SearchOptions(1, "ICON", "clipart", "active");
      assert.propertyVal(srcOpts, "size", "ICON");
      assert.propertyVal(srcOpts, "type", "clipart");
      assert.propertyVal(srcOpts, "safe", "active");
    });
  });
});
