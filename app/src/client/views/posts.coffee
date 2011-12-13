App.Views.PostView = Backbone.View.extend(
  className: 'post'
  displayComments: true

  initialize: ->
    _.bindAll this, "render" 

  render: ->
    $(@el).html window.JST['partials/post'](@model.toJSON())

    if @displayComments
      comments = @model.get('comments')
      commentList = new App.Views.CommentListView(
        el: $(@el).find('section.comments')
        collection: comments
      )
      #$(@el).append commentList.render().el
    @
)

App.Views.PostNewView = Backbone.View.extend(
  model: new App.Models.Post
  events: 
    'submit form': 'submit'
    
  submit: (e) ->
    e.preventDefault();
    #attrs = $(@el).find('form').serialize()
    #console.log 'attrs', attrs

    @model.save
      post:
       title: 'test'
       body: 'body'
    ,
    success: ->
      alert('great success')  
    error: ->
      alert('great failure')   
)

App.Views.PostListView = Backbone.View.extend(
  initialize: -> 
    _.bindAll this, 'render'   
    @collection.bind "add", @render
    @collection.bind "reset", @render

  render: ->
    @addAll()
    @

  addAll: ->
    _.each @collection.models, (post) =>
      @addOne(post)

  addOne: (post) ->
    view = new App.Views.PostView
      model: post
    view.render()
    $(@el).append(view.el)
)

App.Views.CommentListView = Backbone.View.extend(
  tagName: 'section'
  className: 'comments'

  initialize: ->
    @render()

  render: ->
    console.log 'commentListViewRender'
    _.each @collection, (comment) =>
      view = new App.Views.CommentView
        model: comment
      $(@el).append view.render().el
    @
)

App.Views.CommentView = Backbone.View.extend(
  className: 'comment'
  
  initialize: ->
    _.bindAll this, "render"
  
  render: ->
    $(@el).html window.JST['partials/comment'](@model)
    this    
)