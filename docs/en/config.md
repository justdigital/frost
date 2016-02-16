Configuring Frost

The Frost configuration files are location on the 'config' folder. Each file on that folder represents an --env option on execution

You can export the following variables inside the configuration files:

  baseTag: true|false
    Wether to add a <base> tag containing the new site URL to the generated html file

  baseUrl: (function)
    The baseUrl generator function, change this if you want something more specific like adding a condition to the postfix

  bodyClass: "css-classname"
    Any class you want to add to the body tag

  customScript: "Any.javascript.code();"
    Script frost will append on your static page.
    This is used if you need your static pages to execute some javascript that your origin pages don't.

  doctype: "<!doctype html>"
    The doctype of the generated pages

  downloadAssets: true|false
    Wether Frost will download CSS and JS assets from pages

  hostname: "origin.example.com"
    The origin site hostname

  pageLoadTimeout: 1-9999
    The maximum time (in seconds) Frost will wait for the page to load

  pathReplacePatterns: (array replace objects)
    Frost will use this replace patterns on the moment of saving the files. Also, Frost will replace href on link tags
    The replace objects must be declared like the example in the config/example-default.js file

  scheme: "http|https"
    The origin website protocol

  staticBaseUrl: (function)
    Same as baseUrl but for the destination website

  staticDir: "/path/to/static"
    The path to the Frost root folder. This is where the static files will be put

  staticHostname: "example.com"
    Desitnation hostname

  staticScheme: "http|https"
    The static website protocol (destination)

  userAgent: "any user agent" 
    User agent Frost will use to visit your site

