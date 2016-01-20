function Downloader(options) {
  this.pageLoadTimeout = options.pageLoadTimeout || 5000;
  this.onSuccess = options.onSuccess || function(){};
  this.onFailure = options.onFailure || function(){};
  this.visitedURLs = {};
  this.urlQueue = [];
  options.list = options.list || [];
  for (var l in options.list) {
    var item = options.list[l];
    item.url = this.castToTopLevelURL(item.url);
    this.pushToQueue(item);
  }
  this.next();
};

Downloader.webpage = require('webpage');

Downloader.prototype.next = function() {
  if (this.urlQueue.length > 0) {
    console.log("Pages in queue: " + this.urlQueue.length);
    this.download(this.urlQueue.pop());
  } else {
    console.log("Done.");
    phantom.exit();
  }
};

Downloader.prototype.pushToQueue = function (item) {
  this.urlQueue.push(item);
};

Downloader.prototype.download = function (item) {
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
  page.settings.userAgent = 'Frost 1.0 Webkit';

  page.open(url, function (status) {
    console.log("Downloading asset " + url);
    if ('fail' === status) {
      // Falha ao abrir o url (status diferente de 200)
      self.onFailure({
        url: url,
        path: path,
        status: status
      });
    } else {
      self.onSuccess({
        url: url,
        path: path,
        status: status,
        content: page.content
      });
    };
    self.next();
  });
};

Downloader.prototype.castToTopLevelURL = function(url) {
  var pattern = /^(?:https?:)?\/\//ig;
  if (!url.match(pattern)){
    url = global.Cfg.baseUrl() + url;
  }
  return url;
};

module.exports = Downloader;
