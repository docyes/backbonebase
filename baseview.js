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
            this._prepareTemplate(options)
            Backbone.View.apply(this, arguments);
            this.$el.attr('data-cid', this.cid);
            if (this.mid) {
                this.$el.addClass(this.toClassName(this.mid));
                this.$el.attr('data-mid', this.mid);
            }
        },
        
        toClassName: function(className) {
            return className.toLowerCase().replace(/\//g, '-').replace(/\_/g, '');
        },
        
        updateTemplate: function(template, options) {
            options || (options = {});
            _.defaults(options, {compile: true, template: template}); 
            this._prepareTemplate(options);
        },
        
        compileTemplate: function(str) {
            return _.template(str)
        },
        
        renderTemplate: function() {
            var interpolated = this._renderTemplate ? this._renderTemplate.apply(null, arguments) : '';
            this.trigger('render:template', this, interpolated, arguments);
            return interpolated;
        },
        
        renderDeferredTemplate: function() {
            _.defer(this.renderTemplate.bind(this), arguments);
        },
        
        renderDebouncedTemplate: function() {
            if (!this._renderDebouncedTemplate) {
                this._renderDebouncedTemplate = _.debounce(this.renderTemplate.bind(this));
            }
            this._renderDebouncedTemplate.apply(this, arguments);
        },
        
        render: function() {
            return this;
        },
        
        // Internal method to set an internal template reference and compile a template into 
        // callable function.
        _prepareTemplate: function(options) {
            options || (options = {});
            var template = options.template;
            if (template && template !== this.template) {
                this.template = template;
                options.compile = true;
            }
            if (this.template && (options.compile || !this._renderTemplate)) {
                this._renderTemplate = this.compileTemplate(this.template);
            }
        }
        
    });

    //List of view options to be merged as properties.
    var viewOptions = ['template', 'mid'];
    
    return BaseView;
}));
