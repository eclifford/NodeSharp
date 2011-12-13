(function() {
  module.exports = function(path) {
    var app, express;
    express = require('express');
    app = module.exports = express.createServer();
    require("" + __dirname + "/bootstrap").boot(app, path);
    return app.listen(3000);
  };
}).call(this);
