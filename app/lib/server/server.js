(function() {
  module.exports = function(path) {
    var app, express;
    express = require('express');
    app = module.exports = express.createServer();
    require("" + __dirname + "/bootstrap").boot(app, path);
    app.listen(80);
    return console.log('Server starting');
  };
}).call(this);
