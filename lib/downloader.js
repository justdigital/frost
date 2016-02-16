var Path = require(phantom.libraryPath + "/lib/path.js");

function Downloader(options) {
  options = options || {};
  this.pageLoadTimeout = options.pageLoadTimeout || 5000;
  this.onSuccess = options.onSuccess || function(){};
  this.onFailure = options.onFailure || function(){};
  this.followQueue = options.followQueue || true;
  this.pathReplace = options.pathReplaceInsideAssets;
  this.visitedURLs = {};
  this.urlQueue = [];
  options.list = options.list || [];
  for (var l in options.list) {
    var item = options.list[l];
    item.url = Path.castToTopLevelURL(item.url);
    this.pushToQueue(item);
  }

  this.next();
};

Downloader.webpage = require('webpage');

Downloader.prototype.next = function() {
  if (!this.followQueue) return;

  if (this.urlQueue.length > 0) {
    console.log("Pages in queue: " + this.urlQueue.length);
    this.download(this.urlQueue.pop());
  } else {
    console.log("Done downloading assets.");
    phantom.exit();
  }
};

Downloader.prototype.pushToQueue = function (item) {
  this.urlQueue.push(item);
};

Downloader.prototype.treatContent = function (content) {
  if (this.pathReplace) {
    content = Path.pathReplace(content);
  }
  return content;
};

Downloader.prototype.getContentByExtension = function (url, page) {
  if (url.match(/xml/i)) {
    return page.content;  
  } else {
    return page.plainText;
  }
};

Downloader.prototype.download = function (item, cb) {
  var url = item.url;
  var path = item.path;
  var urlTag = url.replace("#", "");
  if (this.visitedURLs[urlTag]) {
    this.next();
    return;
  }

  this.visitedURLs[urlTag] = true;
  var self = this;
  var page = Downloader.webpage.create();
  page.settings.userAgent = global.Cfg.userAgent;

  page.open(url, function (status) {
    console.log("Downloading asset " + url + " Status: " + status);
    if ('fail' === status) {
      // Failure opening URL (status != 200);
      self.onFailure({
        url: url,
        path: path,
        status: status
      });
    } else {
      var content = self.getContentByExtension(url, page);
      self.onSuccess({
        url: url,
        path: path,
        status: status,
        content: self.treatContent(content)
      });
    };
    self.next();
  });
};

module.exports = Downloader;
