# BaseView
*"All your base are belong to us"*

A base Backbone.View Class providing flexible convenience idioms. Features for templating (compiling, caching, etc.), introspection, hieararchical views and consistent class name derivation.

##### constructor / initialize `new View([options])`

There are several special options that, if passed, will be attached directly to the view: `mid` and `template`. If the view defines an initialize function, it will be called when the view is first created. 

##### toClassName `view.toClassName(str)`

Converts a given string into an html/css safe class selector, `'fOo_BaZ' -> foo-baz`. Used primarily by the constructor and the derivation of a `view.el` class attribute based on a passed in or pre-defined `view.mid`. Override this function for customization based on the conventions of `mid` and/or presentation rules.

##### renderTemplate `view.renderTemplate([data])`

All views can optionally have a template, if defined this function will call the compiled template passing the `data` arguments. If a `view.template` is not defined returns an empty string.   

##### renderDeferredTemplate `view.renderDeferredTemplate([data])`

Defers invoking the `view.renderTemplate` function until the current call stack has cleared, similar to using setTimeout with a delay of 0.

##### renderDebouncedTemplate `view.renderDebouncedTemplate([data])`

Will postpone the `view.renderTemplate` function execution. Useful for implementing behavior that should only happen after the input has stopped arriving such as rate-limiting.

##### compileTemplate `view.compileTemplate(template)`

Compiles JavaScript templates into functions that can be evaluated for rendering. By default this uses the underscore `_.template(...)`. Override this function to use other template libraries.

##### updateTemplate `view.updateTemplate(template, options)`

Set an internal template reference and compile into a callable function. By default `template` is compared to `view.template` compiling only when changed but can be override with `{compile: true}`. 
