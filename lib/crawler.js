var Path =       require(phantom.libraryPath + "/lib/path.js");
var Downloader = require(phantom.libraryPath + "/lib/downloader.js");
var Writer =     require(phantom.libraryPath + "/lib/writer.js");

/*
 * Website Crawler
 */
function Crawler(options) {
  this.mode = options.mode || "crawl";
  this.pageLoadTimeout = options.pageLoadTimeout || 5000;
  this.onSuccess = options.onSuccess || function(){};
  this.onFailure = options.onFailure || function(){};
  this.downloadAssets = global.Cfg.downloadAssets || false;
  this.visitedURLs = {};
  this.visitedAssets = {};
  this.urlQueue = [];
  this.assetQueue = [];
  this.downloader = this.generateDownloader(options);
  options.list = options.list || [];
  for (var l in options.list) {
    var item = options.list[l];
    this.pushToQueue(Path.castToTopLevelURL(item));
  }
  this.next();
};

Crawler.webpage = require('webpage');

Crawler.prototype.next = function() {
  if (this.urlQueue.length > 0) {
    console.log("Pages in queue: " + this.urlQueue.length);
    this.crawl(this.urlQueue.pop());
  } else {
    if (this.assetQueue.length > 0) {
      this.downloadAsset(this.assetQueue.pop());
    } else {
      console.log("Done.");
      phantom.exit();
    }
  }
};

Crawler.prototype.pushToQueue = function (item) {
  this.urlQueue.push(item);
};

Crawler.prototype.generateDownloader = function (options) {
  var self = this;
  var opt = {};
  opt.followQueue = false;

  opt.onSuccess = function(page) {
    Writer.writeFile(page.url, page.content, true);
    self.next();
  };

  opt.onFailure   = function(page) {
    console.log("Fail");
    self.next();
  };

  return new Downloader(opt);
}

Crawler.prototype.crawl = function (url) {
  var urlTag = url.replace("#", "");
  if (this.visitedURLs[urlTag]) {
    this.next();
    return;
  }

  this.visitedURLs[urlTag] = true;
  var self = this;
  var page = Crawler.webpage.create();
  /*
  page.onConsoleMessage = function(msg, lineNum, sourceId) {
    console.log('CONSOLE: ' + msg + ' (from line #' + lineNum + ' in "' + sourceId + '")');
  };
  */
  page.onError = function (msg, trace) {
    console.log(msg);
    trace.forEach(function(item) {
      console.log('  ', item.file, ':', item.line);
    });
  };
  page.settings.userAgent = global.Cfg.userAgent;

  console.log("Opening page " + url);
  page.open(url, function (status) {
    if ('fail' === status) {
      // Failed to open url (different status of 200)
      self.onFailure({
        url: url,
        status: status
      });
      self.next();
    } else {

      // Executed callback after page is loaded
      var watchEnded = function(err) {
        // If there is an error, shouts for the failure callback
        if (err) {
          self.onFailure({
            url: url,
            status: status
          });
        } else {
          // If this is the crawling mode, adds the page's links to the queue
          if (self.mode === "crawl") {
            var allUrls = self.getAllURLs(page);
            self.crawlURLs(allUrls);
          }

          if (self.downloadAssets) {
            var assetLinks = page.evaluate(function(){
              return Array.prototype.slice
                .call(document.querySelectorAll("link, script"), 0)
                .map(function(asset){
                  return asset.getAttribute("src") || asset.getAttribute("href");
                });
            });

            // TODO: Custom asset filter
            assetLinks.forEach(function(asset){
              // filters only js or css files
              if (asset.match(/\.(j|cs)s/i)) {
                if (asset.match(/(https?)?:?\/\//i) && !asset.match(Cfg.hostname)) return;
                self.assetQueue.push(asset);
              }
            });
          }

          // Sucessfully loaded page, calls success callback to save the file
          var documentHTML = page.evaluate(function () {
            return document.documentElement && document.documentElement.outerHTML ? document.documentElement.outerHTML : "";
          });
          self.onSuccess({
            url: url,
            status: status,
            content: documentHTML
          });
        }

        // Go to the next url
        self.next();
      };

      // Starts a watcher on the page
      // to wait for the ajax calls to finish
      // Then, it calls the 'watchEnded' function
      Crawler.waitFor(function(){
        var response = page.evaluate(Crawler.pageMissingItems);
        if (response.length > 0) {
          console.log(response.length + " items left for: " + url);
          Crawler.debugInfoFromElements(response);
        } else {
          console.log(url + " successfully crawled");
        }
        return response.length === 0;
      }, watchEnded, self.pageLoadTimeout);
    };
  });
};

Crawler.prototype.downloadAsset = function (url) {
  var urlTag = url.replace("#", "");
  if (this.visitedAssets[urlTag]) {
    this.next();
    return;
  }
  this.visitedAssets[urlTag] = true;
  var path = Path.resolve(Path.getDirFromUrl(url));
  var url  = Path.castToTopLevelURL(url);
  this.downloader.download({
    url: url,
    path: path
  });
};

Crawler.prototype.getAllURLs = function (page) {
  var links = page.evaluate(function (Cfg) {
    var results = Array.prototype.slice.call(document.querySelectorAll("a"), 0)
      .map(function (link) {
        var href = link.getAttribute("href");
        if (href && ( href.match(Cfg.hostname) || !href.match("https?://") ) ) {
          return href.replace("!", "");
        } else {
          return false;
        }
      });
    var cleanResults = [];
    for (var r in results) {
      if (results[r]) {
        cleanResults.push(results[r]);
      }
    }
    return cleanResults;
  }, global.Cfg);
  return links;
};

Crawler.prototype.crawlURLs = function(urls) {
  var self = this;
  if (urls) {
    urls.forEach(function (url) {
      if (url && !self.visitedURLs[url]) {
        self.pushToQueue(Path.castToTopLevelURL(url));
      }
    });
  }
};

Crawler.debugInfoFromElements = function (response) {
  var resp = "  - Missing items: ";
  response.map(function(r){
    if (r.view) {
      resp += "View: " + r.view + "|";
    } else if (r.block) {
      resp += "Block: " + r.block + "|";
    } else if (r.unloaded) {
      resp += "Unloaded: " + r.unloaded + "|";
    } else if (r.content) {
      resp += "Content: " + r.content + "|";
    }
  });
  console.log(resp);
};

Crawler.pageMissingItems = function () {
  var elements = Array.prototype.slice.call(document.querySelectorAll("[data-block],[data-view],[data-unloaded]"), 0);
  var missing = [];
  elements.map(function(el) {
    var block = el.getAttribute("data-block");
    var unloaded = el.getAttribute("data-unloaded");
    var view = el.getAttribute("data-view");
    var content = el.outerHTML;
    missing.push({
      block: block,
      unloaded: unloaded,
      view: view,
      content: content
    });
  });
  return missing;
};

Crawler.waitFor =  function(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, // Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); // Defensive code
      } else {
        if(!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          typeof(onReady) === "string" ? eval(onReady) : onReady("Error loading page."); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          typeof(onReady) === "string" ? eval(onReady) : onReady(); // Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 1000);
};

module.exports = Crawler;
