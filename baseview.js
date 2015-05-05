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
            this.setTemplate(this.template || '');
            Backbone.View.apply(this, arguments);
        },
       
        _ensureElement: function() {
            var el = this.el,
                mid = _.result(this, 'mid'),
                attributes = {};
            Backbone.View.prototype._ensureElement.apply(this, arguments);
            if (el) {
                return;   
            } 
            attributes['data-cid'] = this.cid;
            if (mid) {
                attributes['data-mid'] = mid;
                this.$el.addClass(this.toClassName(mid));
            }
            this.$el.attr(attributes);
        },

        toClassName: function(className) {
            return className.match(/-?[_a-zA-Z]+[_a-zA-Z0-9-]*/g, '').join('-').replace(/[\/\_]/g, '-').toLowerCase();
        },
        
        remove: function() {
            Backbone.View.prototype.remove.apply(this, arguments);
            this.invoke('remove');
        },

        compileTemplate: function(str) {
            return _.template(str)
        },
        
        renderTemplate: function() {
            var interpolated = this.ctemplate.apply(null, arguments);
            this.trigger('render:template', this, interpolated, arguments);
            return interpolated;
        },
        
        renderTemplateDefer: function() {
            _.defer.apply(null, [this.renderTemplate.bind(this)].concat(Array.prototype.slice.call(arguments)));
        },
        
        renderTemplateDebounce: function() {
            if (!this._renderTemplateDebounce) {
                this._renderTemplateDebounce = _.debounce(this.renderTemplate.bind(this));
            }
            this._renderTemplateDebounce.apply(this, arguments);
        },
        
        setTemplate: function(template) {
            this.ctemplate = this.compileTemplate(template);
            this.template = template;
        },
        
        traverse: function(iteratee, options) {
            options || (options = {});
            var view = options.view || this;
            view.each(function(child) {
                iteratee.call(this, view, child);
                this.traverse(iteratee, {view: child}); 
            }, this);
        }

    });

    var array = [];
    var slice = array.slice;

    //List of view options to be merged as properties.
    var viewOptions = ['template', 'mid'];
    
    var childMethods = ['each', 'where', 'findWhere', 'invoke', 'pluck', 'size', 'keys', 'values', 'pairs', 'pick', 'omit', 'defaults', 'clone', 'tap', 'has', 'propertyOf', 'isEmpty'];
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
