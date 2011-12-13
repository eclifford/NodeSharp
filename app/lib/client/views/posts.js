(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  App.Views.PostView = Backbone.View.extend({
    className: 'post',
    displayComments: true,
    initialize: function() {
      return _.bindAll(this, "render");
    },
    render: function() {
      var commentList, comments;
      $(this.el).html(window.JST['partials/post'](this.model.toJSON()));
      if (this.displayComments) {
        comments = this.model.get('comments');
        commentList = new App.Views.CommentListView({
          el: $(this.el).find('section.comments'),
          collection: comments
        });
      }
      return this;
    }
  });
  App.Views.PostNewView = Backbone.View.extend({
    model: new App.Models.Post,
    events: {
      'submit form': 'submit'
    },
    submit: function(e) {
      e.preventDefault();
      return this.model.save({
        post: {
          title: 'test',
          body: 'body'
        }
      }, {
        success: function() {
          return alert('great success');
        },
        error: function() {
          return alert('great failure');
        }
      });
    }
  });
  App.Views.PostListView = Backbone.View.extend({
    initialize: function() {
      _.bindAll(this, 'render');
      this.collection.bind("add", this.render);
      return this.collection.bind("reset", this.render);
    },
    render: function() {
      this.addAll();
      return this;
    },
    addAll: function() {
      return _.each(this.collection.models, __bind(function(post) {
        return this.addOne(post);
      }, this));
    },
    addOne: function(post) {
      var view;
      view = new App.Views.PostView({
        model: post
      });
      view.render();
      return $(this.el).append(view.el);
    }
  });
  App.Views.CommentListView = Backbone.View.extend({
    tagName: 'section',
    className: 'comments',
    initialize: function() {
      return this.render();
    },
    render: function() {
      console.log('commentListViewRender');
      _.each(this.collection, __bind(function(comment) {
        var view;
        view = new App.Views.CommentView({
          model: comment
        });
        return $(this.el).append(view.render().el);
      }, this));
      return this;
    }
  });
  App.Views.CommentView = Backbone.View.extend({
    className: 'comment',
    initialize: function() {
      return _.bindAll(this, "render");
    },
    render: function() {
      $(this.el).html(window.JST['partials/comment'](this.model));
      return this;
    }
  });
}).call(this);
