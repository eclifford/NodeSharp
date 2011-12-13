(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
  App.Views.VideoView = Backbone.View.extend({
    className: 'video',
    displayComments: true,
    events: {
      'click input#btnAddComment': 'addComment',
      'click input#btnAddVote': 'addVote'
    },
    fillInBindings: {
      '.comments': 'comments'
    },
    initialize: function() {
      _.bindAll(this, "render", "addComment");
      this.model.bind('change', this.render);
      $(this.el).html(window.JST['partials/video'](this.model.toJSON()));
      this.comments = new App.Collections.Comments();
      this.comments.url = '/comments/' + this.model.get('_id');
      this.comments.fetch({
        success: __bind(function() {
          var commentList;
          return commentList = new App.Views.CommentListView({
            el: $(this.el).find('div.comments'),
            collection: this.comments
          });
        }, this)
      });
      return this.render();
    },
    render: function() {
      return this.$('.votes').html(this.model.get('votes').length);
    },
    addVote: function() {
      return $.ajax({
        type: "POST",
        url: '/videos/' + this.model.get('_id') + '/addVote',
        success: __bind(function(data) {
          console.log('success');
          return this.model.set(data);
        }, this),
        dataType: 'json'
      });
    },
    addComment: function() {
      var commentBody;
      commentBody = $('textarea#txtAddComment', this.el).val();
      return this.comments.create({
        comment: {
          body: commentBody
        }
      });
    }
  });
  App.Views.CommentListView = Backbone.View.extend({
    tagName: 'section',
    className: 'comments',
    initialize: function() {
      _.bindAll(this, "render", "addOne");
      this.collection.bind("add", this.addOne);
      return this.render();
    },
    addAll: function() {
      return _.each(this.collection.models, __bind(function(comment) {
        return this.addOne(comment);
      }, this));
    },
    addOne: function(comment) {
      var view;
      view = new App.Views.CommentView({
        model: comment
      });
      console.log(this.el);
      return $(this.el).prepend(view.render().el);
    },
    render: function() {
      this.addAll();
      return this;
    }
  });
  App.Views.CommentView = Backbone.View.extend({
    className: 'comment',
    events: {
      'hover': 'hover'
    },
    initialize: function() {
      return _.bindAll(this, "render", "hover");
    },
    render: function() {
      $(this.el).html(window.JST['partials/comment'](this.model.toJSON()));
      return this;
    },
    hover: function() {
      return $(this.el).toggleClass("active");
    }
  });
}).call(this);
