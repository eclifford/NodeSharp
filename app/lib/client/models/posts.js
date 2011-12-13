(function() {
  App.Models.Post = Backbone.Model.extend({
    url: "/posts/new"
  });
  App.Collections.Posts = Backbone.Collection.extend({
    model: App.Models.Post,
    url: "/postsjson"
  });
}).call(this);
