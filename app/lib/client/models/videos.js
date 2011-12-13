(function() {
  App.Models.Video = Backbone.Model.extend({
    url: "/videos"
  });
  App.Collections.Videos = Backbone.Collection.extend({
    model: App.Models.Video,
    url: "/videos.json"
  });
}).call(this);
