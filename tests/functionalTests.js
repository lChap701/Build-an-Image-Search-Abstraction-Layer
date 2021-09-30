// Chai Setup
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
chai.use(chaiHttp);

const app = require("../index");

suite("Functional Tests", () => {
  suite("GET Tests", () => {
    test("1)  GET / Test", (done) => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          assert.equal(res.status, 200, "response status should be 200");
          assert(
            res.text.match(/<title>Image Search Abstraction Layer<\/title>/),
            "response text should contain '<title>Image Search Abstraction Layer</title>'"
          );
          done();
        });
    });

    test("2)  GET /cse Test", (done) => {
      chai
        .request(app)
        .get("/cse")
        .end((err, res) => {
          assert.equal(res.status, 200, "response status should be 200");
          assert(
            res.text.match(/<title>Google Custom Search Engine<\/title>/),
            "response text should contain '<title>Google Custom Search Engine</title>'"
          );
          done();
        });
    });

    test("3)  GET /query Test", (done) => {
      chai
        .request(app)
        .get("/query/test?page=1")
        .end((err, res) => {
          assert.equal(res.status, 200, "response status should be 200");
          assert.isArray(
            JSON.parse(res.text),
            "response body should be an array"
          );
          done();
        });
    });

    test("4)  GET /recent Test", (done) => {
      chai
        .request(app)
        .get("/recent/")
        .end((err, res) => {
          assert.equal(res.status, 200, "response status should be 200");
          assert.isArray(
            JSON.parse(res.text),
            "response body should be an array"
          );
          done();
        });
    });
  });
});
