
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
      var _this = this;
      _.bindAll(this, "render", "addComment");
      this.model.bind('change', this.render);
      $(this.el).html(window.JST['video'](this.model.toJSON()));
      this.comments = new App.Collections.Comments();
      this.comments.url = '/comments/' + this.model.get('_id');
      this.comments.fetch({
        success: function() {
          var commentList;
          return commentList = new App.Views.CommentListView({
            el: $(_this.el).find('div.comments'),
            collection: _this.comments
          });
        }
      });
      return this.render();
    },
    render: function() {
      return this.$('.votes').html(this.model.get('votes').length);
    },
    addVote: function() {
      var _this = this;
      return $.ajax({
        type: "POST",
        url: '/videos/' + this.model.get('_id') + '/addVote',
        success: function(data) {
          console.log('success');
          return _this.model.set(data);
        },
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
      var _this = this;
      return _.each(this.collection.models, function(comment) {
        return _this.addOne(comment);
      });
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
      $(this.el).html(window.JST['comment'](this.model.toJSON()));
      return this;
    },
    hover: function() {
      return $(this.el).toggleClass("active");
    }
  });
