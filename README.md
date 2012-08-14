noksha
======

a very simple dependency manager

Minimal `git` support added to this version but more features will be coming soon.

---

**My Sample `blueprint.yml` for a Backbone project**


	jquery:
	    web:    http://code.jquery.com/jquery.js
	    target: js/libs/jquery.js
	
	requirejs:
	    web:    http://requirejs.org/docs/release/2.0.5/minified/require.js
	    target: js/libs/require.js
	
	underscore:
	    web:    http://underscorejs.org/underscore.js
	    target: js/libs/underscore.js
	
	backbone:
	    web:    http://backbonejs.org/backbone.js
	    target: js/libs/backbone.js
	
	handlebars:
	    web:    http://cloud.github.com/downloads/wycats/handlebars.js/handlebars-1.0.0.beta.6.js
	    target: js/libs/handlebars.js

with this in root if I run `noksha` then it'll generate the following-

	.
	├── blueprint.yml
	└── js
	    └── libs
	        ├── backbone.js
	        ├── handlebars.js
	        ├── jquery.js
	        ├── require.js
	        └── underscore.js
	
	2 directories, 6 files