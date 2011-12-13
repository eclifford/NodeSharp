
  window.App = {};

  App.Routers = {};

  App.Models = {};

  App.Collections = {};

  App.Views = {};

  App.Templates = {};


  App.Models.Comment = Backbone.Model.extend();

  App.Collections.Comments = Backbone.Collection.extend({
    model: App.Models.Comment,
    url: "/comments"
  });


  window.Image = Backbone.Model.extend({});

  window.ImageList = Backbone.Collection.extend({
    model: Image,
    url: "/instagram/popular/",
    search: function(letters) {
      var pattern;
      if (letters === "") return this;
      pattern = new RegExp(letters, "gi");
      return _(this.filter(function(data) {
        return pattern.test(data.get("user").username);
      }));
    }
  });


  App.Models.Post = Backbone.Model.extend({
    url: "/posts/new"
  });

  App.Collections.Posts = Backbone.Collection.extend({
    model: App.Models.Post,
    url: "/postsjson"
  });


  window.Tag = Backbone.Model.extend({});

  window.TagList = Backbone.Collection.extend({
    model: Tag,
    url: "/tags"
  });


  App.Models.Video = Backbone.Model.extend({
    url: "/videos"
  });

  App.Collections.Videos = Backbone.Collection.extend({
    model: App.Models.Video,
    url: "/videos.json"
  });





  window.ImageView = Backbone.View.extend({
    className: "cube",
    template: $("#image-template"),
    events: {
      mouseover: "flipOn",
      mouseout: "flipOff",
      click: "imageClick"
    },
    flipOn: function() {},
    flipOff: function() {},
    imageClick: function() {
      return $("#detailpanel").addClass("active");
    },
    initialize: function() {
      return _.bindAll(this, "render", "imageClick");
    },
    render: function() {
      $(this.el).html(window.JST['image'](this.model.toJSON()));
      return this;
    }
  });


  window.AppView = Backbone.View.extend({
    el: "html",
    events: {
      "hover .cube": "flip",
      "click button#btnSearch": "search",
      "click button#btnFlip": "flip",
      "click button#btnFlipOn": "flipOn",
      "click button#btnFlipOff": "flipOff"
    },
    initialize: function() {
      var t;
      _.bindAll(this, "render", "appendItem");
      this.collection = new window.ImageList();
      t = this;
      this.collection.fetch({
        success: function() {
          return t.render();
        },
        failure: function() {
          return alert("fail");
        }
      });
      this.collection.bind("add", this.appendItem);
      setInterval((function() {
        return t.flip();
      }), 1000);
      return this.render();
    },
    flipOn: function() {
      var elements;
      elements = $(".cube");
      return $(elements).addClass("flip");
    },
    flipOff: function() {
      var elements;
      elements = $(".cube");
      return $(elements).removeClass("flip");
    },
    flip: function() {
      var elements, random;
      elements = $(".cube");
      random = Math.floor(Math.random() * elements.length);
      return $(elements[random]).toggleClass("flip");
    },
    search: function() {
      var searchTerm, t;
      $("#instagramapp").html("");
      t = this;
      searchTerm = $("#txtSearch").val();
      this.collection.url = "/instagram/tags/" + searchTerm;
      return this.collection.fetch({
        success: function() {
          return t.render();
        },
        failure: function() {
          return alert("fail");
        }
      });
    },
    renderList: function(items) {
      var t;
      t = this;
      $("#instagramapp").html("");
      items.each(function(item) {
        return t.appendItem(item);
      });
      return this;
    },
    render: function() {
      var t;
      t = this;
      return _(this.collection.models).each(function(item, index) {
        var column, row;
        row = Math.floor(index / 10);
        column = index - (row * 10);
        item.set({
          index: index,
          xpos: column * 150,
          ypos: row * 150
        });
        return t.appendItem(item);
      });
    },
    appendItem: function(item) {
      var view;
      view = new ImageView({
        model: item
      });
      return $("#instagramapp").append(view.render().el);
    }
  });


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
      var _this = this;
      return _.each(this.collection.models, function(post) {
        return _this.addOne(post);
      });
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
      var _this = this;
      console.log('commentListViewRender');
      _.each(this.collection, function(comment) {
        var view;
        view = new App.Views.CommentView({
          model: comment
        });
        return $(_this.el).append(view.render().el);
      });
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


  window.TagListView = Backbone.View.extend({
    el: "ul.tagcloud",
    initialize: function() {
      var t;
      _.bindAll(this, "render", "appendItem");
      this.collection = new window.TagList();
      t = this;
      this.collection.fetch({
        success: function() {
          return t.render();
        },
        failure: function() {
          return alert("fail");
        }
      });
      this.collection.bind("add", this.appendItem);
      return this.render();
    },
    render: function() {
      var t;
      t = this;
      return _(this.collection.models).each(function(item, index) {
        return t.appendItem(item);
      });
    },
    appendItem: function(item) {
      var view;
      view = new TagView({
        model: item
      });
      return $(this.el).append(view.render().el);
    }
  });

  window.TagView = Backbone.View.extend({
    tagName: 'li',
    initialize: function() {
      return _.bindAll(this, "render");
    },
    render: function() {
      console.log('rendering');
      $(this.el).html(window.JST['tag'](this.model.toJSON()));
      return this;
    }
  });


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
      $(this.el).html(window.JST['partials/video'](this.model.toJSON()));
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
      $(this.el).html(window.JST['partials/comment'](this.model.toJSON()));
      return this;
    },
    hover: function() {
      return $(this.el).toggleClass("active");
    }
  });
