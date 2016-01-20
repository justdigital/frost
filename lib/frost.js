/*
 * Frost
 *
 * Handles arguments and manages the Crawler, Writer and Downloader
 */

// Dependency loading
var Crawler    = require("./crawler.js");
var Downloader = require("./downloader.js");
var Writer     = require("./writer.js");

function Frost(options) {
  this.options = options || {};
  this.resource = this.getResource();
}

Frost.prototype.getResource = function () {
  if (!this.options.type) {
    console.log("Type not specified.");
    return false;
  }
  this.options.onFailure = function(page){
    console.log(page.url + " not crawled because of errors, jumping to the next.");
  };

  if (this.options.type === "page") {
    this.options.onSuccess = function(page){
      Writer.writeFile(page.url, page.content);
    };
    return new Crawler(this.options);
  } else if (this.options.type === "asset") {
    this.options.onSuccess = function(page){
      Writer.writeFile(page.url, page.content, true);
    };
    return new Downloader(this.options);
  }
};
