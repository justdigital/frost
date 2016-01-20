Frost Execution

To run Frost from the command line you should use the following command:

  phantomjs index.js

Also, you must specify some options:

  --mode: "list" or "crawl" (required)
    list  - makes Frost run on a specified list of links, no more or less.
    crawl - makes Frost run on every page on a list of links AND their child pages (It is not recommended to use the 'crawl' mode on a automatic execution because it can be hard to predict the execution time)
            The crawl mode does not follow any link more than once

  --list: "/,/link1/path,/products" (required)
    The path list to be followed by Frost. It is recommended that if you use mode="crawl", the list should have only one path (usually the home path "/")

    --type: The type of the Frost behavior, defaults to "page".

  --env: "default|local|hom|prod|etc" (default: "default")
    Specifies what config file to use. The config files should be located at config/{env}.js


One basic implementation example is:

  phantomjs index.js --list="/,/products,/recipes" --mode="list" --env="hom"


Downloading assets

In some situations, we will need to download physical files from the dynamic site and put them on the static folder. For that, we have created the --type option.

  phantomjs index.js --type="asset"

Just like the main command, you can still pass --env and --list:

  --env: Just like the 

  --list: "/panel/sitemap.xml->sitemap.xml,/app.css->styles/app.css"
    This is a bit different that the --type="page" form. Here, the paths are also splitted by comma, but you need to specify the origin and destination from the file:

      A path containing
      /panel/sitemap.xml->sitemap.xml

      Will get the file at {origin_base_url}/panel/sitemap.xml
      And save the file at {static_folder}/sitemap.xml
