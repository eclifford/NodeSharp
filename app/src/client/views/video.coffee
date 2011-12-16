App.Views.VideoView = Backbone.View.extend(
  className: 'video'
  displayComments: true

  events: 
    'click input#btnAddComment': 'addComment'
    'click input#btnAddVote': 'addVote'

  fillInBindings: 
    '.comments': 'comments'

  initialize: ->
    _.bindAll this, "render", "addComment"
    @model.bind 'change', @render
    $(@el).html window.JST['video'](@model.toJSON())

    
    @comments = new App.Collections.Comments()
    @comments.url = '/comments/' + @model.get('_id')
    @comments.fetch
      success: =>
        commentList = new App.Views.CommentListView(
          el: $(@el).find('div.comments')
          collection: @comments
        )
    
    @render()

  render: ->
    @.$('.votes').html(@model.get('votes').length)

  addVote: ->
    $.ajax
      type: "POST"
      url: '/videos/' + @model.get('_id') + '/addVote'
      success: (data) =>
        console.log 'success'
        @model.set(data)
      dataType: 'json'

  addComment: ->
    commentBody = $('textarea#txtAddComment', @el).val()
    #comment = new App.Models.Comment()
    #comment.body = commentBody
    @comments.create(
      comment:
        body: commentBody
    )

    # console.log 'comments', @comments
    # # Create comment
    # $.ajax
    #   type: "POST"
    #   url: '/videos/' + @model.get('_id') + '/addComment'
    #   data:
    #     comment:
    #       body: commentBody
    #   success: (data) =>
    #     #@commentList.collection.push(data)
    #     #@commentList.render()

    #     comment = new App.Models.Comment()
    #     comment.body = data.
    #     @comments.create(data)
    #   dataType: 'json'   
)

App.Views.CommentListView = Backbone.View.extend(
  tagName: 'section'
  className: 'comments'

  initialize: ->
    _.bindAll this, "render", "addOne"
    @collection.bind "add", @addOne
  #  @collection.bind "reset"
    @render()

  addAll: ->
    _.each @collection.models, (comment) =>
      @addOne(comment)

  addOne: (comment) ->
    view = new App.Views.CommentView
      model: comment
    console.log @el
    $(@el).prepend view.render().el

  render: ->
    @addAll()
    @
)

App.Views.CommentView = Backbone.View.extend(
  className: 'comment'

  events: 
    'hover': 'hover'

  initialize: ->
    _.bindAll this, "render", "hover"
  
  render: ->
    $(@el).html window.JST['comment'](@model.toJSON())
    this   
    
  hover: ->
    $(@el).toggleClass "active"
    
 
)