/*
 * Website Crawler
 */
function Crawler(options) {
  this.mode = options.mode || "crawl";
  this.pageLoadTimeout = options.pageLoadTimeout || 5000;
  this.onSuccess = options.onSuccess || function(){};
  this.onFailure = options.onFailure || function(){};
  this.visitedURLs = {};
  this.urlQueue = [];
  options.list = options.list || [];
  for (var l in options.list) {
    var item = options.list[l];
    this.pushToQueue(this.castToTopLevelURL(item));
  }
  this.next();
};

Crawler.webpage = require('webpage');

Crawler.prototype.next = function() {
  if (this.urlQueue.length > 0) {
    console.log("Pages in queue: " + this.urlQueue.length);
    this.crawl(this.urlQueue.pop());
  } else {
    console.log("Done.");
    phantom.exit();
  }
};

Crawler.prototype.pushToQueue = function (item) {
  this.urlQueue.push(item);
};

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
  page.settings.userAgent = 'Frost 1.0 Webkit';

  page.open(url, function (status) {
    console.log("Opening page " + url);

    if ('fail' === status) {
      // Falha ao abrir o url (status diferente de 200)
      self.onFailure({
        url: url,
        status: status
      });
      self.next();
    } else {

      // Callback que é executado
      // apos carregar a página ser
      // carregada
      var watchEnded = function(err) {
        // Se existir erro depois do timeout, dispara
        // callback de falha e vai pro próximo
        if (err) {
          self.onFailure({
            url: url,
            status: status
          });
        } else {
          // Página carregada com sucesso, dispara o callback de sucesso
          // para salvar o arquivo
          var documentHTML = page.evaluate(function () {
            return document.documentElement && document.documentElement.outerHTML ? document.documentElement.outerHTML : "";
          });

          // Se o modo for crawl, adiciona os links
          // da página na fila
          if (self.mode === "crawl") {
            var allUrls = self.getAllURLs(page);
            self.crawlURLs(allUrls);
          }

          // Dispara callback de sucesso
          // para que o arquivo seja salvo
          self.onSuccess({
            url: url,
            status: status,
            content: documentHTML
          });
        }
        self.next();
      };

      // Inicia um watcher na página
      // para aguardar todas as requisições
      // ajax terminarem.
      // Por fim, chama a função declarada acima:
      // 'watchEnded'
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

Crawler.prototype.getAllURLs = function(page) {
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
        self.pushToQueue(self.castToTopLevelURL(url));
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

Crawler.prototype.castToTopLevelURL = function(url) {
  var pattern = /^(?:https?:)?\/\//ig;
  if (!url.match(pattern)){
    url = url.replace(/[#\/]+/, "/#");
    url = global.Cfg.baseUrl() + url;
  }
  return url;
};

Crawler.waitFor =  function(testFx, onReady, timeOutMillis) {
  var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3000, //< Default Max Timout is 3s
    start = new Date().getTime(),
    condition = false,
    interval = setInterval(function() {
      if ( (new Date().getTime() - start < maxtimeOutMillis) && !condition ) {
        // If not time-out yet and condition not yet fulfilled
        condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
      } else {
        if(!condition) {
          // If condition still not fulfilled (timeout but condition is 'false')
          typeof(onReady) === "string" ? eval(onReady) : onReady("Error loading page."); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        } else {
          // Condition fulfilled (timeout and/or condition is 'true')
          typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
          clearInterval(interval); //< Stop this interval
        }
      }
    }, 1000);
};

module.exports = Crawler;
