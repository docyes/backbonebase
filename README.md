# BaseView
*"All your base are belong to us"*

A base Backbone.View Class providing flexible convenience idioms. Features for templating (compiling, caching, etc.), introspection, hieararchical views and consistent class name derivation.

## constructor / initialize`new View([options])`
There are several special options that, if passed, will be attached directly to the view: mid and template. If the view defines an initialize function, it will be called when the view is first created. 

## template`view.renderTemplate([data])`

All views can optionally have a template, if defined calling this function will call the compiled template.  
 
