/*
  Frost Configuration File

  This is the main configuration file which contains all the settings for a desired profile.

  This is the file that will be loaded if you don't pass any --env options

  If you need more than one profile (like prod or dev), just copy this file
  to any file (eg. something.js) and run frost with the --env="something" option
 */

module.exports = {
  /* 
   * General Configuration
   */
  staticDir: "../app/public/static", // Static files directory
  pageLoadTimeout: 35,               // The time Frost will wait for the page to load

  /*
   * Origin Configuration
   */
  scheme: "http",                   // http or https
  hostname: "origin.example.com",   // origin hostname

  // the baseUrl generator function, change this if you want something more
  // specific like adding a condition to the postfix
  baseUrl: function(postfix) {
    postfix = postfix || "";
    return this.scheme + "://" + this.hostname + postfix;
  },

  /*
   * Static (destination) Configuration
   */
  staticScheme: "http",                      // http or https
  staticHostname: "static.perdigao.just",    // destination hostname
  staticBaseUrl: function (postfix) {        // destination hostname generator
    postfix = postfix || "";
    return this.staticScheme + "://" + this.staticHostname + postfix;
  }
};
