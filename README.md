*[Portuguese Version](LEIAME.md)*

# README

###FROST- Static web page generator

## Prerequisites

Before you start, make sure you have this thing installed:

1. [phantomjs](http://phantomjs.org/)

##Configuring Frost

The Frost configuration files are located on the 'config' folder. Each file on that folder represents an `--env` option on execution. You can export the following variables inside the configuration files:

  * staticDir: "../path/para/static"
    * The relative path to the Frost root folder. This is where the static files will be put

  * scheme: "http|https"
    * The origin website protocol

  * hostname: "origin.example.com"
    * The origin site hostname

  * baseUrl: (function)
    * The baseUrl generator function, change this if you want something more specific like adding a condition to the postfix

  * staticScheme: "http|https"
    * The static website protocol (destination)

  * staticHostname: "example.com"
    * Destination hostname

  * staticBaseUrl: (function)
    * Same as baseUrl but for the destination website

  * pageLoadTimeout
    * The maximum time that frost will wait for the website to load (in seconds)

## Execution

To run Frost from the command line you should use the following command:

```
$ phantomjs index.js
```

Also, you must specify some options:

  * `--mode`: "list" or "crawl" (required)
    * list  - makes Frost run on a specified list of links, no more or less.
    * crawl - makes Frost run on every page on a list of links AND their child pages (It is not recommended to use the 'crawl' mode on a automatic execution because it can be hard to predict the execution time).
    *PS: The crawl mode does not follow any link more than once*

  * `--list`: "/,/link1/path,/products" (required)
    * The path list to be followed by Frost. It is recommended that if you use mode="crawl", the list should have only one path (usually the home path "/").

  * `--type`: The type of the Frost behavior, defaults to "page".

  * `--env`: "default|local|hom|prod|etc" (default: "default")
    Specifies what config file to use. The config files should be located at config/{env}.js


Two basic implementation examples:

1st `"list"`
```
$ phantomjs index.js --list="/,/products,/recipes" --mode="list" --env="{env}"
```
2nd `"crawl"`
```
$ phantomjs index.js --list="/" --mode="crawl" --env="{env}"
```

##Downloading assets

In some situations, you will need to download physical files from the dynamic site and put them on the static folder. For that, we have created the `--type` option.

  `$ phantomjs index.js --type="asset"`

Just like the main command, you can still pass `--env` and `--list`:

  * `--env`:  Just like shown before.

  * `--list: "/panel/sitemap.xml->sitemap.xml,/app.css->styles/app.css"`
    * This is a bit different that the `--type="page"` form. Here, the paths are also splitted by comma, but you need to specify the origin and destination from the file:

     1. A path containing:  `/panel/sitemap.xml->sitemap.xml`
     2. Will get the file at `{origin_base_url}/panel/sitemap.xml`
     3. And save the file at `{static_folder}/sitemap.xml`

## Contributing

Frost contribution system uses GitHub to manage the pull-requests. So, basically, to contribute, you'll create a [fork](https://help.github.com/articles/fork-a-repo/), commit your changes and submit a pull-request based on a issue created by any GitHub user. These are more detailed steps:

1. [Fork](https://help.github.com/articles/fork-a-repo/) the project and set-up the repository.
2. Create a new branch to work on: **git checkout -b new_branch**
3. Work on the code and commit your changes. **WARNING: You must commit your files with LF line endings. [Read more here](https://help.github.com/articles/dealing-with-line-endings/)**
4. After making sure your code is fully tested, you can push your commit(s) to the remote repo: **git push origin new_branch**
5. Now you must create a [pull-request](https://help.github.com/articles/creating-a-pull-request) with a good, specific title and a good description containing **the issue number** a small piece of documentation explaining what you did.
6. The code contributors will review the changes now, keep in mind that it is very common to receive code change requests, so, try to follow them or discuss the importance of the requested change to make sure that everything is done the best possible way.

## Licensing

Copyright 2016 Frost

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
