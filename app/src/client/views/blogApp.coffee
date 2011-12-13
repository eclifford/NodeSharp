# (($) ->


#   methods = 
#     load: ->
    
#     init: (options) ->
#       settings = callback: ->      
#       $.extend settings, options if options

#       # Collections
#       app.collections.postList = new PostList()

#       # Views
#       app.views.postList = new PostListView()
#       app.views.tagList = new TagListView() 

#       #app.routers.main.navigate "home", false  if "" == Backbone.history.getFragment() 
#       #Backbone.history.start()
  
#   $.fn.initApp = (method) ->
#     if methods[method]
#       methods[method].apply this, Array::slice.call(arguments, 1)
#     else if typeof method == "object" or not method
#       methods.init.apply this, arguments
#     else
#       $.error "method " + method + " does not exist"

# ) @jQuery 

# $(document).ready ->
#   $().initApp "load"
#   $().initApp "init"

