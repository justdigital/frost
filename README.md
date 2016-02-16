*[Portuguese Version](LEIAME.md)*

# README

###FROST- Static web page generator

## Prerequisites

Before you start, make sure you have this thing installed:

1. [phantomjs](http://phantomjs.org/)

## Installing Frost

Frost installation is simple:

```
git clone https://github.com/justdigital/frost.git
```

To make it easier to execute, create a symlink to the bin folder of your user:

```
$ ln -s /path/to/frost/bin/frost /usr/local/bin/frost
```

##Configuring Frost

The Frost configuration files are located on the 'config' folder. Each file on that folder represents an `--env` option on execution. You can export the following variables inside the configuration files:
|Option|Type|Description|
|:---|:---|---:|
|baseTag|bool|Wether to add a base tag containing the new site URL to the generated html file|
|baseUrl|function|The baseUrl generator function, change this if you want something more specific like adding a condition to the postfix|
|bodyClass|string|Any class you want to add to the body tag|
|customScript|string|Script frost will append on your static page. This is used if you need your static pages to execute some javascript that your origin pages don't.|
|doctype|string|The doctype of the generated pages|
|downloadAssets|bool|Wether Frost will download CSS and JS assets from pages|
|hostname|string|The origin site hostname|
|pageLoadTimeout|integer|The maximum time (in seconds) Frost will wait for the page to load
|pathReplacePatterns|array|Frost will use this replace patterns on the moment of saving the files. Also, Frost will replace href on link tags. The replace objects must be declared like the example in the config/example-default.js file|
|scheme|"http/https"|The origin website protocol|
|staticBaseUrl|function|Same as baseUrl but for the destination website|
|staticDir|string|The path to the Frost root folder. This is where the static files will be put|
|staticHostname|string|Desitnation hostname|
|staticScheme|"http/https"|The static website protocol (destination)|
|userAgent|string|User agent Frost will use to visit your site|

## Execution

To run Frost from the command line you should use the following command:

```
$ frost
```

Also, you must specify some options:

  * `--mode`: "list" or "crawl" (default: crawl)
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
$ frost --list="/,/products,/recipes" --mode="list" --env="{env}"
```
2nd `"crawl"`
```
$ frost --list="/" --mode="crawl" --env="{env}"
```

##Downloading assets

In some situations, you will need to download physical files from the dynamic site and put them on the static folder. For that, we have created the `--type` option.

  `$ frost --type="asset"`

Just like the main command, you can still pass `--env` and `--list`:

  * `--path-replace-inside-assets (default: false)`
    * Makes the path replacing functionality work on the files given on the --list option    
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
