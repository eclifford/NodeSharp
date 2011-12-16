# Overview

NodeSharp is a boilerplate project aimed at providing a series of best practices in how to architect a sophisticated client/server web application.

My goal with this project was to use as many new technologies as possible to make the barrier of entry so high that only I would ever use it.

# Project Structure
Below is the app folder structure. 
		/app
			/lib                   # Compiled version of /src
			/src
				client
					/controllers       # Client controllers/routes
					/models            # Backbone models/collections
					/templates         # Jade client templates
					/test              # Jasmine Tests
					/views             # Backbone Views
					app.coffee         # Client namespace allocation / app startup
				server
					/controllers       # Express routes
					/models						 # Mongoose Schemas
					/modules					 # Internal Libraries
					/tests             # Should & Vows tests
					/views             # Jade server templates
					server.coffee      # Node server
					settings.coffee    # Server settings
		/doc
			/
		/logs
			master.log
			workers.access.log
			workers.error.log
		/public            
			/assets                # Compiled assets for client
			/images
			/javascripts
				/vendor              # JS files compiled into /assets/vendor.js
			/stylesheets
				/stylus              # Stylus files compiled into /assets/all.css
				/vendor              # Css files compiled into /assets/all.css
		Cakefile                 # Packaging scripts / testrunner
		server.js                # Entry point into the app

# Features

* Server: [node.js](http://nodejs.org/) 
* MVC Server Framework: [express](http://nodejs.org/) 
* MVC Cient Framework: [backbone](http://documentcloud.github.com/backbone/)
* Database: [mongodb](http://www.mongodb.org/
* Database ODM: [mongooose](http://mongoosejs.com/)
* Multi-Core Optimization: [cluster](http://learnboost.github.com/cluster/)
* Authentication: [everyauth](https://github.com/bnoguchi/everyauth)
* Stylesheets: [Stylus](http://learnboost.github.com/stylus/)
* Server Templates: [Jade](http://jade-lang.com/)
* Client Templates: [Jade](http://jade-lang.com/)
* Preprocessor: [CoffeeScript](http://jashkenas.github.com/coffee-script/)
* Config [node-settings](https://github.com/mgutz/node-settings)
* Server-side Testing: [should](https://github.com/visionmedia/should.js) + [vows](http://vowsjs.org/)
* Client-side Testing [jasmine](http://pivotal.github.com/jasmine/) + [jasmine-jquery](https://github.com/velesin/jasmine-jquery)
* Auto compilation/packaging of CoffeeScript, Jade, Stylus, JS, CSS

# Installation

1. `npm install -d`
1. `NODE_ENV=development nodemon bootstrap.js` or `NODE_ENV=development node` bootstrap.js'
1. Go to http://localhost:3000

# Enabling Auto commpilation 
To Enable auto compilation/packaging of assets open a seperate terminal window and start the cake watch task. Note that you must restart it currently upon the addition of new files(I'll fix this shortly).

1. `cake watch`

# Notes
* Facebook login in the example won't work unless you change out keys and point to your own app(which accepts localhost)

# Live Example
You can see the demo app running live at
http://thevideowar.no.de





