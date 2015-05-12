# BaseView
*"All your base are belong to us"*

A base Backbone.View Class providing flexible convenience idioms. Features for templating (compiling, caching, etc.), introspection, hieararchical views and consistent class name derivation.

##### constructor / initialize `new View([options])`

There are several special options that, if passed, will be attached directly to the view: `mid` and `template`. If the view defines an initialize function, it will be called when the view is first created. 

All views have a DOM element `view.el` with additional meta-data set by the constructor; `data-cid`,`data-mid` and `class`. 

`data-cid` is derived from `view.cid`, `data-mid` from `view.mid` and `class` from `view.mid` using the `view.toClassName` formatting function. The `data-mid` and `class` attributes are optionally created only if `view.mid` is defined. The class attribute setting is additive; non-destructive.

```js
var view = new BaseView({mid: 'views/MyView'});
$(body).append(view.render().el)
```
Results in...
```html
<div data-cid="view1" data-mid="views/MyView" class="views-myview"></div>
```

##### Catalog of Events 
Here's the complete list of built-in BaseView events, with arguments.

* **"render:template"** (view, interpolated, arguments) -- when renderTemplate has been called; capturing the interpolated rendered output. Useful when using async `view.renderTemplateDefer` and `view.renderTemplateDebounce` functions.

##### children `view.children`

A simple object for storing child `Backbone.View` references. Child views can be assigned to `view.children` in `view.initialize` or optionally passed in the `view.constructor`. By default an empty object for reference is available in the `view.initialize` function.

```js
var View = BaseView.extend({
    initialize: function() {
        this.children.child = new Backbone.View();  
    }
});
```
OR
```js
var View = BaseView.extend({children: {child: new Backbone.View()}});
```

##### toClassName `view.toClassName(className)`

Converts a given string into an html/css safe class selector, `'fOo_BaZ' -> foo-baz`. Used primarily by the constructor and the derivation of a `view.el` class attribute based on a passed in or pre-defined `view.mid`. Override this function for customization based on the conventions of `mid` and/or presentation rules.

##### template `view.template`
All views have a template at all times (the template property). If not specified template is an empty string.

##### ctemplate `view.ctemplate`
A callable template function derived from the compilation of `view.template`. A handy reference instead of re-compiling the template all the time.

##### setTemplate `view.setTemplate(template)`

Set an internal template reference `view.template` and compile into a callable function `view.ctemplate`.

##### compileTemplate `view.compileTemplate(template)`

Compiles JavaScript templates into functions that can be evaluated for rendering. By default this uses the underscore `_.template(...)`. Override this function to use other template libraries.

```js
compileTemplate: function(template) {
    return Handlebars.compile(template);
}
```

##### renderTemplate `view.renderTemplate([data])`

All views can optionally have a template, if defined this function will call the compiled template passing the `data` arguments. If a `view.template` is not defined returns an empty string.   

```js
var View = BaseView.extend({
    template: '<%- time %>',
    render: function() {
        this.$el.html(this.renderTemplate({time: new Date().getTime()});
        return this;
    }
});
```

##### renderTemplateDefer `view.renderTemplateDefer([data])`

Defers invoking the `view.renderTemplate` function until the current call stack has cleared, similar to using setTimeout with a delay of 0.

##### renderTemplateDebounce `view.renderTemplateDebounce([data])`

Will postpone the `view.renderTemplate` function execution. Useful for implementing behavior that should only happen after the input has stopped arriving such as rate-limiting.

##### Underscore Methods

BaseView proxies to Underscore.js to provide many iteration functions on `view.children`. They aren't all documented here, but you can take a look at the Underscore documentation for the full details...

* each
* where
* findWhere
* invoke
* pluck
* size
* keys
* values
* pairs
* pick
* omit
* defaults
* clone
* tap
* has
* propertyOf
* isEmpty

```js
view.each(function(child) {
    child.render();
});

view.invoke('remove');
```

##### traverse `view.traverse(iteratee, options)`

Traverse a n-level deep tree of `view.children` starting from the top and working down, yielding each in turn to an iteratee function. Each invocation of iteratee is called with two arguments: `(parent, child)`. Use `options.view` if you would like set the root child view to traverse.

##### remove `view.remove()`

Removes a view from the DOM, and calls stopListening to remove any bound events that the view has listenTo'd. Aditionally invokes remove on all `view.children`.


