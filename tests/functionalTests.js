// Chai Setup
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
chai.use(chaiHttp);

const app = require("../index");

// Connect to DB
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db = mongoose.connection;

suite("Functional Tests", () => {
  suite("GET Tests", () => {
    test("1)  GET / Test", () => {
      chai
        .request(app)
        .get("/")
        .end((err, res) => {
          assert.equal(res.status, 200, "response status should be 200");
          assert(
            res.text.match(/<title>Image Search Abstraction Layer<\/title>/),
            "response text should contain '<title>Image Search Abstraction Layer</title>'"
          );
        });
    });

    test("2)  GET /cse Test", () => {
      chai
        .request(app)
        .get("/cse")
        .end((err, res) => {
          assert.equal(res.status, 200, "response status should be 200");
          assert(
            res.text.match(/<title>Google Custom Search Engine<\/title>/),
            "response text should contain '<title>Google Custom Search Engine</title>'"
          );
        });
    });

    /*test("3)  GET /query Test", () => {
      chai
        .request(app)
        .get("/query/test?page=1")
        .end((err, res) => {
          assert.equal(res.status, 200, "response status should be 200");
          assert.isArray(res.body, "response body should be an array");
        });
    });

    test("4)  GET /recent Test", () => {
      chai
        .request(app)
        .get("/recent/")
        .end((err, res) => {
          assert.equal(res.status, 200, "response status should be 200");
          assert.isArray(res.body, "response body should be an array");
        });
    });*/
  });
});
