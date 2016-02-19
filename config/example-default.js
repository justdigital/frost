/*
  Frost Configuration File

  This is the main configuration file which contains all the settings for a desired profile.

  This is the file that will be loaded if you don't pass any --env options

  If you need more than one profile (like prod or dev), just copy this file
  to any file (eg. something.js) and run frost with the --env="something" option
 */

module.exports = {
  /*************************
   * General Configuration *
   *************************/
  staticDir: "/var/www/html/example_static",   // Static files directory
  pageLoadTimeout: 35,                         // The time in seconds Frost will wait for the page to load
  downloadAssets: false,                       // Whether to download assets or not (JS and CSS)
  userAgent: "Frost 1.0 Webkit",               // What user agent to use on the requests
  removeHashSymbol: false,                     // Transforms paths into hash, eg.: /#/foo/bar -> /foo/bar



  /*****************************
   * Page Writer Configuration *
   *****************************/
  customScript: "alert(\"yo!\");",      // Add a custom script when the page loads
  baseTag: true,                        // Whether to add a <base> tag to the generated pages
  bodyClass: "static",                  // Add any css class to the <body> tag?
  doctype: "<!doctype html>",           // What doctype to use on generated files
  
  // Path expressions (RegExp) to apply on the moment of writing the file 
  pathReplacePatterns: [{
    from: /\/example\/path\/([a-z]+)\/[0-9]+/i,
    to: "/example/path/$1"
  }, {
    from: /\/foo\/bar\/([a-z]+)/,
    to: "/bar/foo/$1"
  }],



  /************************
   * Origin Configuration *
   ************************/
  scheme: "http",                   // http or https
  hostname: "origin.example.com",   // origin hostname

  // the baseUrl generator function, change this if you want something more
  // specific like adding a condition to the postfix
  baseUrl: function(postfix) {
    postfix = postfix || "";
    return this.scheme + "://" + this.hostname + postfix;
  },



  /**************************************
   * Static (destination) Configuration *
   **************************************/
  staticScheme: "http",                      // http or https
  staticHostname: "example.com",             // destination hostname
  staticBaseUrl: function (postfix) {        // destination hostname generator
    postfix = postfix || "";
    return this.staticScheme + "://" + this.staticHostname + postfix;
  }
};
