var Path = {
  resolve: function(path) {
    // Remove multiple slashes
    path = path.replace(/\/{2,}/, "/").replace(/^\/+|\/+$/,"");

    // Remove querystring cache cleaners
    path = path.replace(/(.*)\?.*/ig, "$1");

    var splitted = path.split("/");
    var newPath = [];

    splitted.forEach(function(v, k, arr){
      if (newPath.length > 0 && v === "..") {
        newPath.pop();
      } else {
        newPath.push(v);
      }
    });

    return newPath.join("/");
  },

  castToTopLevelURL: function(url) {
    var pattern = /^(?:https?:)?\/\//ig;
    if (!url.match(pattern)){
      if (url[0] !== "/") {
        url = "/" + url;
      }
      url = global.Cfg.baseUrl(url);
    }
    return url;
  },

  getDirFromUrl: function(url, appendStatic){
    appendStatic = (appendStatic !== undefined) ? appendStatic : true;
    var dir = "";
    if (appendStatic) {
      dir += global.Cfg.staticDir + "/";
    }
    dir += url
      .replace(global.Cfg.baseUrl(), "")
      .replace("#", "");
    return dir;
  },

  patternReplace: function(path) {
    var patterns = global.Cfg.pathReplacePatterns || [];
    patterns.forEach(function(v){
      if (path.match(v.from)) {
        var reg = new RegExp(v.from.source, "igm");
        path = path.replace(reg, v.to);
      }
    });
    return path;
  }
};

module.exports = Path;
