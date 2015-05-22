# BackboneBase
*"All your base are belong to us"*
A framework-agnostic complimentary set of Backbone.View, Backbone.Model and Backbone.Collection extensions providing flexible convenience idioms and utilities.

## BackboneBase.View
An extenstion of Backbone.View. Features for templating (compiling, caching, etc.), introspection, hieararchical views and consistent class name derivation.

##### constructor / initialize `new View([options])`
There are several special options that, if passed, will be attached directly to the view: `mid` and `template`. If the view defines an initialize function, it will be called when the view is first created. 

All views have a DOM element `view.el` with additional meta-data set by the constructor; `data-cid`,`data-mid` and `class`. 

`data-cid` is derived from `view.cid`, `data-mid` from `view.mid` and `class` from `view.mid` using the `view.toClassName` formatting function. The `data-mid` and `class` attributes are optionally created only if `view.mid` is defined as a value or function. The class attribute setting is additive; non-destructive.

```js
var view = new BackboneBase.View({mid: 'views/MyView'});
$(body).append(view.render().el)
```
Results in...
```html
<div data-cid="view1" data-mid="views/MyView" class="views-myview"></div>
```

##### Catalog of Events 
Here's the complete list of built-in BackboneBase.View events, with arguments.

* **"render:template"** (view, interpolated, arguments) -- when renderTemplate has been called; capturing the interpolated rendered output. Useful when using async `view.renderTemplateDefer` and `view.renderTemplateDebounce` functions.

##### children `view.children`

A simple object for storing child `Backbone.View` references. Child views can be assigned to `view.children` in `view.initialize` or optionally passed in the `view.constructor`. By default an empty object for reference is available in the `view.initialize` function.

```js
var View = BackboneBase.View.extend({
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
var View = BackboneBase.View.extend({
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

Traverse a n-level deep tree of `view.children` starting from the top and working down, yielding each in turn to an iteratee function. Each invocation of iteratee is called with two arguments: `(parent, child)`. Use `options.view` to select a specific `view.children` view for traversal.

##### remove `view.remove()`

Removes a view from the DOM, and calls stopListening to remove any bound events that the view has listenTo'd. Aditionally invokes remove on all `view.children`.

## BackboneBase.Model
An extenstion of Backbone.Model. Features for attribute accessors (getters, setters, etc.) and resetting the state of a model.

##### constructor / initialize `new Model([attributes], [options])`
There are several special options that, if passed, will be attached directly to the model: `setters` and `getters`. If the model defines an initialize function, it will be called when the model is first created. 

##### getters / setters
If a getters or setters hash is not passed directly, uses this.setters or this.getters as the sources. setters and getters are written in the format {"attribute": "callback"}. The attribute is the corresponding `model.attribute` that when called with `model.setter` or `model.getter` will execute the callback. The callback may be either the name of a method on the model, or a direct function body. `callback` is called with `(attr, value, options)` as arguments. Return the value to either set/get.

The getters or setters property may also be defined as a function that returns a getters or setters hash, to make it easier to programmatically define your accessors, as well as inherit them from parent models.

##### getter `model.getter(attribute, [options])`

Get the current value of an attribute from the model via the matching `model.getters` hash. If there is no matching `model.getters` hash defaults to `model.get`. 

A model getter that casts an attribute to a boolean might look something like this:

```js
var Model = BackboneBase.Model.extend({
    "getters": {
        "enabled": function(attr, value) {
            if (value==="yes") {
                return true;
            }
            return false;
        }
    }
});
var model = new Model({enabled: "yes"});
model.getter("enabled");
```

##### setter `model.setter(attributes, [options])`

Set a hash of attributes (one or many) on the model via matching `model.setters` hash entries. If any of the attributes change the model's state, a "change" event will be triggered on the model. If there is no matching `model.setters` hash defaults to `model.set`.

A model setter that converts a boolean to a string attribute value might look something like this:

```js
var Model = BackboneBase.Model.extend({
    "setters": {
        "enabled": function(attr, value) {
            if (value===true) {
                return "yes";
            }
            return "no";
        }
    }
});
var model = new Model();
model.setter("enabled", true);
```

##### reset `model.reset(attrs, options)`

Clear a model silently and subsquently set new attributes. Useful for when you don't want a double set of change events and the defaults are not sufficient. `options` are proxied to `model.set` while `{setter: true}` will use `model.setter`.

## BackboneBase.Collection

An extenstion of Backbone.Collection. Features for sorting and duplication.

##### duplicate `collection.duplicate([options])`

Returns a new instance of the collection with a new list of models (model references are not maintained). Analogous to a deep `collection.clone` operation. options can also be passed which will map to the second argument in `Collection` constructor. 

##### reverse `collection.reverse()`

Reverses the order of the internally stored array of models.

## BackboneBase.Request

Request is module that can be mixed in to any Model or Collection object, giving the object the ability to manage a stack of requests; the stack has a bounded capacity of one. If the stack is full, new additions will remove the previous item from the stack. When a request is complete and an item is in the stack, the pop operation will result in an empty stack.

##### abortFetch([options])

##### stackFetch([options])

