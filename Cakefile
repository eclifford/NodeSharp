fs 		       = require 'fs'
path         = require 'path'
CoffeeScript = require 'coffee-script'
walk 				 = require 'walk'
jade				 = require 'jade'
nib          = require 'nib'

js =
	paths: [
		'public/javascripts/vendor/jquery-1.7.min.js'
		'public/javascripts/vendor/underscore.js'
		'public/javascripts/vendor/backbone.js'
		'public/javascripts/vendor/json2.js'
		'public/javascripts/vendor/jquery-tags/jquery.tagsinput.min.js'
		'public/javascripts/vendor/jaderuntime.js'
		'app/lib/client/app.js'
		'app/lib/client/controllers'
		'app/lib/client/models'
		'app/lib/client/views'
	]
	output: 
		'public/assets/app.js'

css = 
	paths: [
		'public/stylesheets/vendor'
	]
	output: 
		'public/assets/vendor.css'

coffeescripts = 
	paths: [
		'app/src'
	]

jst = 
	paths: [
		'app/src/client/templates'
	]
	output: 
		'public/assets/templates.js' 
	namespacesCleaner: [
		'app/src/client/templates/',
		'.jade'
	]

stylus = 
	paths: [
		'public/stylesheets/stylus'
	]
	output: 
		'public/assets/all.css' 

jsFiles = []
cssFiles = []
jstFiles = []
stylusFiles =[]

task 'build', 'Build files', ->
	invoke 'assets:packageJS'
	invoke 'assets:packageCSS'
	invoke 'assets:packageJST'

task 'watch', 'Watch source files and build changes', ->
	invoke 'assets:watchJS'
	invoke 'assets:watchCSS'
	invoke 'assets:watchCoffee'
	invoke 'assets:watchJST'
	invoke 'assets:watchStylus'

task 'assets:watchJS', 'Build and Package JS files', ->
	for path, index in js.paths
		walk path, '.js', (file) ->
			jsFiles.push(file)
			fs.watchFile file, (curr, prev) ->
				if +curr.mtime isnt +prev.mtime
					console.log "change detected in #{file}"
					invoke 'assets:packageJS'		

task 'assets:packageJS', 'Package JS files', ->
	buffer = ''
	for file, index in jsFiles then do (file, index) ->
		buffer += fs.readFileSync file, 'utf8'
		if index == jsFiles.length - 1
			fs.writeFile js.output, buffer, 'utf8', ->
				console.log 'packageJS finished'

task 'assets:watchCSS', 'Build and Package CSS files', ->
	for path, index in css.paths
		walk path, '.css', (file) ->
			cssFiles.push(file)
			fs.watchFile file, (curr, prev) ->
				if +curr.mtime isnt +prev.mtime
					console.log "change detected in #{file}"
					invoke 'assets:packageCSS'	

task 'assets:packageCSS', 'Package CSS files', ->
	buffer = ''
	for file, index in cssFiles then do (file, index) ->
		buffer += fs.readFileSync file, 'utf8'
		if index == cssFiles.length - 1
			fs.writeFile css.output, buffer, 'utf8', ->
				console.log 'packageCSS finished'

task 'assets:watchCoffee', 'Watch and Build Coffee files', ->
	for path, index in coffeescripts.paths
		walk path, '.coffee', (file) ->
			fs.watchFile file, (curr, prev) ->
				if +curr.mtime isnt +prev.mtime
					console.log "change detected in #{file}"
					try
						file_contents = fs.readFileSync file, 'utf8'
						code = CoffeeScript.compile file_contents
						fs.writeFile file.replace('/src', '/lib').replace('.coffee', '.js'), code, 'utf8', ->
							console.log 'coffee -> js finished'
					catch error
						print_error error, file, file_contents

task 'assets:watchJST', 'Watch JST', ->
	for path, index in jst.paths
		walk path, '.jade', (file) ->
			jstFiles.push(file)
			fs.watchFile file, (curr, prev) ->
				if +curr.mtime isnt +prev.mtime
					console.log "change detected in #{file}"
					invoke 'assets:packageJST'		

task 'assets:packageJST', 'Build and package jade templates', ->
	buf = []
	buf.push 'window.JST = {};\n'
	#buf.push helpers()

	for template, index in jstFiles then do (template, index) ->
		buf.push compileTemplate(template).toString()
		if index == jstFiles.length - 1
			buf = buf.join("")
			fs.writeFile jst.output, buf, 'utf8', ->
				console.log 'packageJST finished'

task 'assets:watchStylus', 'Watch Stylus', ->
	for path, index in stylus.paths
		walk path, '.stylus', (file) ->
			stylusFiles.push(file)
			fs.watchFile file, (curr, prev) ->
				if +curr.mtime isnt +prev.mtime
					console.log "change detected in #{file}"
					invoke 'assets:packageStylus'	

task 'assets:packageStylus', 'Build and package stylus files', ->
  buf = []
  for sheet, index in stylusFiles then do (sheet, index) ->
    fs.readFile(sheet, 'utf8', (err, data) ->
      buf.push compileStylus(data, sheet)
      if index == stylusFiles.length - 1
        buf = buf.join("")
        fs.writeFile stylus.output, buf, 'utf8', ->
          console.log 'packageStylus finished'
    )

compileStylus = (contents, filename) ->
  if filename? and filename.match(/.styl$/)?
    css = ''
    require('stylus')(contents)
      .set('filename', filename)
      .use(require('nib')())
      .render (err, out) -> throw err if err; css = out
    css
  else
    contents

compileTemplate = (template) ->
	data = fs.readFileSync(template, 'utf8')

	# Build the namespace from template path - templateCleaners
	templateNamespace = template
	for clean in jst.namespacesCleaner
		templateNamespace = templateNamespace.replace(clean, '')

	"window.JST['" + templateNamespace + "'] = " + jade.compile(data, {compileDebug: false, inline: false, client: true}) + ';\n'
	
walk = (path, extension, callback) ->
	stat = fs.statSync(path)
	if stat and stat.isDirectory()
		list = fs.readdirSync(path)
		if list
			for file in list
				walk(path + '/' + file, extension, callback)
	else if stat.isFile() 
		if path.match(extension)?
			console
			callback(path)

uglifyOutput = (output) ->
  ast = jsp.parse output  # parse code and get the initial AST
  ast = pro.ast_mangle ast # get a new AST with mangled names
  ast = pro.ast_squeeze ast # get an AST with compression optimizations
  pro.gen_code ast # compressed code here

# helpers = ->
#     # Get Jade helpers
#     attrs = jade.runtime.attrs.toString()
#     escape = jade.runtime.escape.toString()
#     rethrow = jade.runtime.rethrow.toString()
    
#     # if @settings.compileDebug
#     #   obj = """
#     #     var jade = {
#     #       attrs: attrs,
#     #       escape: escape,
#     #       rethrow: rethrow
#     #     };\n
#     #   """
#     #   [attrs, escape, rethrow, obj].join('\n')
#     # else
#     obj = """
#       var jade = {
#         attrs: attrs,
#         escape: escape
#       };\n
#     """
#     [attrs, escape, obj].join('\n')

# task 'test', 'Run the test suite (and re-run if anything changes)', ->
#   suite = null
#   build ->
#     do runTests = ->
#       suite?.kill()
#       suiteNames = [
#         'DevelopmentIntegration'
#         'ProductionIntegration'
#         'AbsoluteIntegration'
#         'RemoteIntegration'
#         'BenchmarkDynamic'
#         'BenchmarkStatic'
#       ]
#       suiteIndex = 0
#       do runNextTestSuite = ->
#         return unless suiteName = suiteNames[suiteIndex]
#         suite = spawn "coffee", ["-e", "{reporters} = require 'nodeunit'; reporters.default.run ['#{suiteName}.coffee']"], cwd: 'test'
#         suite.stdout.on 'data', (data) -> print data.toString()
#         suite.stderr.on 'data', (data) -> print data.toString()
#         suite.on 'exit', -> suiteIndex++; runNextTestSuite()
#       invoke 'docs'  # lest I forget

#     watchTargets = (targets..., callback) ->
#       for target in targets
#         watchit target, include: true, (event) ->
#           callback() unless event is 'success'
#     watchTargets 'src', -> build runTests
#     watchTargets 'test', 'Cakefile', runTests


# Print error message
print_error = (error, file_name, file_contents) ->
  line = error.message.match /line ([0-9]+):/
  if line && line[1] && line = parseInt(line[1])
    contents_lines = file_contents.split "\n"
    first = if line-4 < 0 then 0 else line-4
    last  = if line+3 > contents_lines.size then contents_lines.size else line+3
    console.log "Error compiling #{file_name}. \"#{error.message}\"\n"
    index = 0
    for line in contents_lines[first...last]
      index++
      line_number = first + 1 + index
      console.log "#{(' ' for [0..(3-(line_number.toString().length))]).join('')} #{line}"
  else
    console.log """
Error compiling #{file_name}:

  #{error.message}

"""

