# BaseView
*"All your base are belong to us"*

A base Backbone.View Class providing flexible convenience idioms. Features for templating (compiling, caching, etc.), introspection, hieararchical views and consistent class name derivation.

#### constructor / initialize `new View([options])`
There are several special options that, if passed, will be attached directly to the view: `mid` and `template`. If the view defines an initialize function, it will be called when the view is first created. 

#### renderTemplate `view.renderTemplate([data])`

All views can optionally have a template, if defined this function will call the compiled template passing the `data` arguments. If a template is not defined returns an empty string.   

#### renderDeferredTemplate `view.renderDeferredTemplate([data])`

Defers invoking the renderTemplate function until the current call stack has cleared, similar to using setTimeout with a delay of 0.

#### renderDebouncedTemplate `view.renderDebouncedTemplate([data])`

Will postpone the renderTemplate function execution. Useful for implementing behavior that should only happen after the input has stopped arriving such as rate-limiting.


