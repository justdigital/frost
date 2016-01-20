/*
 * Command Line Interface for Frost
 *
 * Parses arguments from STDIN and calls Frost accordingly
 */

// Dependency loading
var options = require("./lib/options.js");
var Frost   = require("./lib/frost.js");

// Environment detection and config loading
var env = options.getOption("env", "default");
var Cfg = require("./config/" + env + ".js");
global.Cfg = Cfg;

// Argument parsing
var type = options.getOption("type", "page");
var mode = options.getOption("mode", "crawl");
var list = options.getOption("list", Cfg.baseUrl());

// Building the formatted arguments from the input
if (type === "page") {
  list = list.split(",").map(function(item){
    return item.trim();
  });
} else if (type === "asset") {
  list = list.split(",").map(function(item){
    item = item.split("->");
    return {
      url: item[0],
      path: item[1]
    };
  });
} else {
  // Unrecognized type error
  console.log("Unrecognized type, please use 'asset' or 'page'.");
  return;
}

// Frost handling
var frost = new Frost({
  pageLoadTimeout: 35000,
  type: type,
  mode: mode,
  list: list
});
