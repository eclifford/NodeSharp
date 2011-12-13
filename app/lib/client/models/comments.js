(function() {
  App.Models.Comment = Backbone.Model.extend();
  App.Collections.Comments = Backbone.Collection.extend({
    model: App.Models.Comment,
    url: "/comments"
  });
}).call(this);
