var fs = require('fs');
var Path = require(phantom.libraryPath + '/lib/path.js');

var helpers = {
  urlAllowedCharacters: "[a-zA-Z0-9\-._~:\/?#\\[\\]@!$&'()\\*\\+,;=]",

  baseTag: function(){
    var script = '<base href="' + global.Cfg.staticBaseUrl() + '" />';
    return script;
  },

  canonical: function (path) {
    var link = '<link rel="canonical" href="' + global.Cfg.staticBaseUrl(path) + '" />';
    return link;
  },

  customScript: function(custom){
    var script = '<script>';
    script += custom;
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
  }
};
module.exports = {
  folderFilter: function(link) {
    var forbiddenLinks = ["build", "images"];
    return forbiddenLinks.indexOf(link) === -1;
  },

  addBodyClass: function(content, className) {
    return content.replace(/<body.*?(class=['"][a-z\-\_0-9]*['"])?.*?>/ig, function(match) {
      if (match.match(/class/)) {
        return match.replace(/class=['"](.*?)['"]/ig, "class=\"$1 " + className + "\"");
      } else {
        return match.replace(/<body(.*?)>/ig, "<body$1 class=\"" + className + "\">");
      }
    });
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
    url = Path.patternReplace(url);
    var path;
    if (isAsset) {
      path = "/" + Path.getDirFromUrl(url);
    } else {
      var dir = Path.getDirFromUrl(url);
      path = dir + "/index.html";
      content = this.treatContent(content, url);
    }
    
    fs.write(path, content, 'w');
  },

  treatContent: function(content, url){
    // Adds the doctype
    content = global.Cfg.doctype + content;

    // Adds a static class to the body
    content = this.addBodyClass(content, global.Cfg.bodyClass);

    // Changes the script srcs
    var exp = new RegExp("<script(.*?)src=[\"']https?:\/\/" + global.Cfg.hostname + ".*?\/(.*?)[\"'](.*?)>", "ig");
    content = content.replace(exp, "<script$1src='" + global.Cfg.staticBaseUrl("/") + "$2'$3>");

    // Changes absolute styles hrefs
    var exp = new RegExp("<link(.*?)href=[\"']https?:\/\/" + global.Cfg.hostname + ".*?\/(.*?)[\"'](.*?)>", "ig");
    content = content.replace(exp, "<link$1href='" + global.Cfg.staticBaseUrl("/") + "$2'$3>");

    if (global.Cfg.baseTag) {
      // Adds a 'base' tag to the head
      content = content.replace(/<head(.*?)>/ig, '<head$1>' + helpers.baseTag());
    }
    
    /*
    // Adds a cannonical link to the head
    var path = Path.getDirFromUrl(url, false);
    content = content.replace(/<head(.*?)>/ig, '<head$1>' + helpers.canonical(path));
    */

    // Switches hash links to physical links
    content = content.replace(/<a(.*)href=["'][\/#]+(.*)["'](.*?)>/ig, '<a$1href="' + global.Cfg.staticBaseUrl("/") + '$2"$3>');

    // Fixes absolute links from old url to the new one
    content = this.fixAbsoluteLinks(content);

    // Manually call BlockJS's onReady script
    content = content.replace(/<\/body>/ig, helpers.customScript(global.Cfg.customScript) + '</body>');

    return content;
  },

  fixAbsoluteLinks: function(content){
    var exp = "<a.+?href=['\"]" + helpers.urlAllowedCharacters + "+['\"].*?>";
    return content.replace(new RegExp(exp, "igm"), function(match) {
      match = Path.patternReplace(match);
      match = match.replace(Cfg.baseUrl(), Cfg.staticBaseUrl());
      return match;
    });
  },

};
