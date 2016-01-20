var system = require('system');
var args = [];
var options = {};
var passedArgs = system.args;

for (var i in passedArgs) {
  var arg = passedArgs[i];
  if (arg[0] !== "-") {
    args.push(arg);
  } else {
    var opt = arg.replace(/(^(\-*)|(\-*)$)/ig, "");
    var stripped = opt.split("=");
    var name = stripped[0];
    var value = stripped[1] || true;
    options[name] = value;
  }
}

module.exports = {
  getOption: function(name, fallback) {
    fallback = fallback || false;
    return options[name] || fallback;
  },
  hasArg: function(name) {
    var has = false;
    for (var a in args) {
      if (args[a] === name) {
        has = true;
      }
    }
    return has;
  }
};
