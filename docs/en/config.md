Configuring Frost

The Frost configuration files are location on the 'config' folder. Each file on that folder represents an --env option on execution

You can export the following variables inside the configuration files:

  staticDir: "../path/para/static"
    The relative path to the Frost root folder. This is where the static files will be put

  scheme: "http|https"
    The origin website protocol

  hostname: "origin.example.com"
    The origin site hostname

  baseUrl: (function)
    The baseUrl generator function, change this if you want something more specific like adding a condition to the postfix

  staticScheme: "http|https"
    The static website protocol (destination)

  staticHostname: "example.com"
    Desitnation hostname

  staticBaseUrl: (function)
    Same as baseUrl but for the destination website
