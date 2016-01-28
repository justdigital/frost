var fs = require('fs');
var helpers = {
  baseTag: function(){
    var script = '<base href="' + global.Cfg.baseUrl() + '" />';
    return script;
  },

  canonical: function (path) {
    var link = '<link rel="canonical" href="' + global.Cfg.staticBaseUrl(path) + '" />';
    return link;
  },

  readyScript: function(){
    var script = '<script>';
    script += "Static.ready();";
    script += '</script>';
    return script;
  },

  redirectScript: function(){
    var script = '<script>';
    script += "var hostname = window.location.hostname;";
    script += 'var newHref = window.location.href.replace(hostname + "/", hostname + "/#");';
    script += "window.location.href = newHref;";
    script += '</script>';
    return script;
  },

  addBodyClass: function(content, className) {
    return content.replace(/<body.*?(class=['"][a-z\-\_0-9]*['"])?.*?>/ig, function(match) {
      if (match.match(/class/)) {
        return match.replace(/class=['"](.*?)['"]/ig, "class=\"$1 " + className + "\"");
      } else {
        return match.replace(/<body(.*?)>/ig, "<body$1 class=\"" + className + "\">");
      }
    });
  }
};
module.exports = {
  folderFilter: function(link) {
    var forbiddenLinks = ["build", "images"];
    return forbiddenLinks.indexOf(link) === -1;
  },

  clean: function(){
    var list = fs.list(global.Cfg.staticDir);
    for(var i = 0; i < list.length; i++){
      var item = list[i];
      if (item !== "." && item !== ".."){
        if (this.folderFilter(item)) {
          console.log(list[i]);
          fs.removeTree(global.Cfg.staticDir + "/" + list[i]);
        }
      }
    }
  },
  writeFile: function(url, content, isAsset){
    var path;
    if (isAsset) {
      var dir = global.Cfg.staticDir + "/";
      url = this.getDirFromUrl(url);
      path = dir + url;
    } else {
      var dir = this.getDirFromUrl(url);
      path =  dir + "/index.html";
      content = this.treatContent(content, url);
    }
    fs.write(path, content, 'w');
  },

  treatContent: function(content, url){
    content = "<!doctype html>" + content;

    // Adds a static class to the body
    content = helpers.addBodyClass(content, "static");

    //Adds the base tag
    content = content.replace(/<body(.*?)>/ig, '<body$1>' + helpers.baseTag());

    // Changes the script srcs
    content = content.replace(/<script(.*?)src=["'](?!(?:http:)?\/\/)(.*?)["'](.*?)>/ig, "<script$1src='" + global.Cfg.staticBaseUrl("/") + "$2'$3>");

    // Changes the styles hrefs
    content = content.replace(/<link(.*?)href=["'](.*?)["'](.*?)>/ig, "<link$1href='" + global.Cfg.staticBaseUrl("/") + "$2'$3>");

    // Adds a 'base' tag to the head
    content = content.replace(/<head(.*?)>/ig, '<head$1>' + helpers.baseTag());
    
    /*
    // Adds a cannonical link to the head
    var path = this.getDirFromUrl(url, false);
    content = content.replace(/<head(.*?)>/ig, '<head$1>' + helpers.canonical(path));
    */

    // Switches hash links to physical links
    content = content.replace(/<a(.*)href=["'][\/#]+(.*)["'](.*?)>/ig, '<a$1href="' + global.Cfg.staticBaseUrl("/") + '$2"$3>');

    /*
    // Manually call BlockJS's onReady script
    content = content.replace(/<\/body>/ig, helpers.readyScript() + '</body>');
    */

    return content;
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
  }
};
