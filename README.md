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

* **"render:template"** (view, interpolated, arguments) -- when renderTemplate has been called; capturing the rendered output. Useful when using async `view.deferredTemplate` and `view.debouncedTemplate` functions.

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

##### collections `view.collections`

A simple object for storing multiple `Backbone.Collection` references. Child collections can be assigned to `view.collections` in `view.initialize` or optionally passed in the `view.constructor`. By default an empty object for reference is available in the `view.initialize` function.

##### models `view.models`

A simple object for storing multiple `Backbone.Model` references. Child models can be assigned to `view.models` in `view.initialize` or optionally passed in the `view.constructor`. By default an empty object for reference is available in the `view.initialize` function.

##### toClassName `view.toClassName(str)`

Converts a given string into an html/css safe class selector, `'fOo_BaZ' -> foo-baz`. Used primarily by the constructor and the derivation of a `view.el` class attribute based on a passed in or pre-defined `view.mid`. Override this function for customization based on the conventions of `mid` and/or presentation rules.

##### renderTemplate `view.renderTemplate([data])`

All views can optionally have a template, if defined this function will call the compiled template passing the `data` arguments. If a `view.template` is not defined returns an empty string.   

```js
var View = BaseView.extend({
    template: '<%- time %>',
    render: function() {
        this.$el.html(this.renderTemplate({time: new Date().getTime()});
        return this;
    }
);
```

##### renderDeferredTemplate `view.renderDeferredTemplate([data])`

Defers invoking the `view.renderTemplate` function until the current call stack has cleared, similar to using setTimeout with a delay of 0.

##### renderDebouncedTemplate `view.renderDebouncedTemplate([data])`

Will postpone the `view.renderTemplate` function execution. Useful for implementing behavior that should only happen after the input has stopped arriving such as rate-limiting.

##### compileTemplate `view.compileTemplate(template)`

Compiles JavaScript templates into functions that can be evaluated for rendering. By default this uses the underscore `_.template(...)`. Override this function to use other template libraries.

```js
compileTemplate: function(template) {
    return Handlebars.compile(template);
}
```

##### updateTemplate `view.updateTemplate(template, options)`

Set an internal template reference and compile into a callable function. By default `template` is compared to `view.template` compiling only when changed but can be override with `{compile: true}`.

##### invokeChildren `view.invokeChildren(methodName, *arguments)`

Calls the method named by methodName on each child in the `view.children`. Any extra arguments passed to invoke will be forwarded on to the method invocation. Will call n-deep in the tree of associated `BaseView` children.

 
