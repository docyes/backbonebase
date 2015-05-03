(function(root, factory) {
    // Set up BaseView appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['underscore', 'jquery', 'backbone', 'exports'], function(_, $, Backbone, exports) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            root.BaseView = factory(root, exports, _, $, Backbone);
        });
        // Next for Node.js or CommonJS. jQuery may not be needed as a module.
    } else if (typeof exports !== 'undefined') {
        var _ = require('underscore'),
            $ = require('jquery'),
            Backbone = require('backbone');
        factory(root, exports, _, $, Backbone);
        // Finally, as a browser global.
    } else {
        root.BaseView = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$), root.Backbone);
    }
}(this, function(root, BaseView, _, $, Backbone) {
    
    var BaseView = Backbone.View.extend({
            
        constructor: function(options) {
            options || (options = {});
            _.extend(this, _.pick(options, viewOptions));
            this.children = options.children || {};
            this.collections = options.collections || {};
            this.models = options.models || {};
            this.setTemplate(this.template || '');
            Backbone.View.apply(this, arguments);
        },
       
        _ensureElement: function() {
            if (this.el) {
                return;
            }
            var mid = _.result(this, 'mid'),
                attributes = {};
            Backbone.View.prototype._ensureElement.apply(this, arguments);
            attributes['data-cid'] = this.cid;
            if (mid) {
                attributes['data-mid'] = mid;
                this.$el.addClass(this.toClassName(mid));
            }
            this.$el.attr(attributes);
        },

        toClassName: function(className) {
            return className.toLowerCase().replace(/\//g, '-').replace(/\_/g, '');
        },
        
        invokeChildren: function(methodName) {
            _.each(this.children, function(child) {
                child[methodName].apply(child, Array.prototype.slice.call(arguments, 1));    
            });
        },
        
        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
            this.invokeChildren('remove');
        },

        compileTemplate: function(str) {
            return _.template(str)
        },
        
        renderTemplate: function() {
            var interpolated = this.ctemplate.apply(null, arguments);
            this.trigger('render:template', this, interpolated, arguments);
            return interpolated;
        },
        
        renderDeferredTemplate: function() {
            _.defer.apply(null, [this.renderTemplate.bind(this)].concat(Array.prototype.slice.call(arguments)));
        },
        
        renderDebouncedTemplate: function() {
            if (!this._renderDebouncedTemplate) {
                this._renderDebouncedTemplate = _.debounce(this.renderTemplate.bind(this));
            }
            this._renderDebouncedTemplate.apply(this, arguments);
        },
        
        // Internal method to set an internal template reference and compile a template into 
        // callable function.
        setTemplate: function(template) {
            this.ctemplate = this.compileTemplate(template);
            this.template = template;
        }
        
    });

    var array = [];
    var slice = array.slice;

    //List of view options to be merged as properties.
    var viewOptions = ['template', 'mid'];
    
    var childMethods = ['keys', 'values', 'pairs', 'pick', 'omit', 'defaults', 'clone', 'tap', 'has', 'propertyOf', 'isEmpty'];
    _.each(childMethods, function(method) {
        if (!_[method]) {
            return;
        }
        BaseView.prototype[method] = function() {
            var args = slice.call(arguments);
            args.unshift(this.children);
            return _[method].apply(_, args);
        };
    });
    
    return BaseView;
}));
