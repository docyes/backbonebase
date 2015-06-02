(function() {
    module('BackboneBase.View', {
        setup: function() {
        }
    });
    test('class name sanitizer', 1, function() {
        var view = new BackboneBase.View();
        equal(view.toClassName('aB_Cd-e/f**g'), 'ab-cd-e-f-g', 'class name converted to lowercase and _ replaced with hyphens')
    });
    test('el attribute extensions', 9, function() {
        var expectedModuleId = 'Foo_Bar/Bar-Foo';
        var expectedClassName = 'foo-bar-bar-foo';
        var view = new BackboneBase.View();
        strictEqual(view.toClassName(expectedModuleId), expectedClassName, 'conversion of string to safe class name');
        var viewWithModuleId = new BackboneBase.View({mid: expectedModuleId, className: 'bar'});
        strictEqual(viewWithModuleId.mid, expectedModuleId, 'Passed in mid is set as instance member');
        strictEqual(viewWithModuleId.$el.attr('data-mid'), expectedModuleId, 'View element data-mid matches view instance mid attribute');
        ok(viewWithModuleId.$el.hasClass(expectedClassName), 'View element class was set to value of data-mid');
        ok(viewWithModuleId.$el.hasClass('bar'), 'View element class argument honored and not destroyed');

        var viewWithModuleIdFunction = new BackboneBase.View({
            mid: function() {
                return expectedModuleId;    
            }
        });
        strictEqual(viewWithModuleIdFunction.$el.attr('data-mid'), expectedModuleId, 'View element data-mid matches view instance mid function return');

        var simpleViewDataCid = new BackboneBase.View();
        strictEqual(simpleViewDataCid.cid, simpleViewDataCid.$el.attr('data-cid'), 'View element data-cid matches view instance cid attribute');
    
        var el = document.createElement('div');
        var simpleView = new BackboneBase.View({el: el, mid: 'a'});
        strictEqual(simpleView.$el.attr('data-mid'), undefined, 'passed in element is not mutated with a data-mid attribute');
        strictEqual(simpleView.$el.attr('data-cid'), undefined, 'passed in element is not mutated with a data-cid attribute');
    });
    test('children', 7, function() {
        var viewConstructorTest = new BackboneBase.View({tagName: 'span'});
        ok(!!viewConstructorTest.children, 'constructor creates children instance member');
        
        var ViewChild = BackboneBase.View.extend({
            initialize: function() {
               this.children.child = new Backbone.View(); 
            }
        });
        var viewChild = new ViewChild();
        var viewPassedChildConstructorTest = new ViewChild({children: {child2: viewChild}});
        ok(viewPassedChildConstructorTest.children.child instanceof Backbone.View, 'child view created in constructor is correct');
        ok(viewPassedChildConstructorTest.children.child2 instanceof ViewChild, 'child view passed in constructor is correct');
        
        var ChildView = BackboneBase.View.extend({
            tagName: 'span',
            clickedCount: 0,
            events: {
                'click a': function(e) {
                    this.clickedCount++;
                    e.preventDefault();
                }
            },
            render: function() {
                this.$el.html('<a href="#">test</a>');
                return this;
            }
        });
        var ParentView = BackboneBase.View.extend({
            initialize: function() {
                this.children.child = new ChildView();
            },
            render: function() {
                this.$el.append(this.children.child.render().el);
                return this;
            }
        });
        var view = new ParentView();
        document.body.appendChild(view.render().el);
        view.children.child.$('a').click();
        equal(view.children.child.clickedCount, 1, 'clicked once');
        view.remove();
        view.children.child.$('a').click();
        equal(view.children.child.clickedCount, 1, 'remove unbound child listener');
        
        var view = new ParentView();
        
        view.traverse(function(parent, child) {
            equal(parent, view, 'is expected parent');
            equal(child, view.children.child, 'is expected child');
        });
    });
    /*
    test('template', 19, function() {
        viewNoTemplateTest = new BackboneBase.View();
        strictEqual(viewNoTemplateTest.template, '', 'no view template defined defaults to empty string');

        viewTemplateConstructorTest = new BackboneBase.View({template: 'a'});
        strictEqual(viewTemplateConstructorTest.template, 'a', 'template passed in constructor');

        var ViewWithTemplate = BackboneBase.View.extend({template: 'a'});
        var viewWithTemplate = new ViewWithTemplate();
        strictEqual(viewWithTemplate.template, 'a', 'template in class definition');

        viewTemplateConstructorOverrideTest = new ViewWithTemplate({template: 'b'});
        strictEqual(viewTemplateConstructorOverrideTest.template, 'b', 'template based in constructor trumps class definition');

        viewNoRenderTemplate = new BackboneBase.View();
        strictEqual(viewNoRenderTemplate.renderTemplate(), '', 'calling renderTemplate with no-existing template definition returns empty string');

        viewDefaultRender = new BackboneBase.View();
        strictEqual(viewDefaultRender.render().el, viewDefaultRender.el, 'default render method returns a reference to itself');

        var viewWithTemplate = new ViewWithTemplate();
        strictEqual(viewWithTemplate.renderTemplate(), 'a', 'calling renderTemplate with an existing template is callable and returns an expected value');

   
        var viewWithTemplate = new ViewWithTemplate();
        var spyOnRenderTemplateSpy = sinon.spy();
        viewWithTemplate.on('render:template', spyOnRenderTemplateSpy);
        viewWithTemplate.renderTemplate('foo', 'bar');
        ok(spyOnRenderTemplateSpy.calledOnce, 'render:template event fires');
        ok(spyOnRenderTemplateSpy.calledWithMatch(viewWithTemplate, 'a'), 'render:template callback called with expected arguments');
        strictEqual(spyOnRenderTemplateSpy.args[0][2][0], 'foo', 'renderTemplate called with matching first argument');
        strictEqual(spyOnRenderTemplateSpy.args[0][2][1], 'bar', 'renderTemplate called with matching second argument');
        
        var viewWithTemplate = new ViewWithTemplate();
        var spyOnRenderTemplateSpy = sinon.spy();
        var clock = sinon.useFakeTimers();
        viewWithTemplate.on('render:template', spyOnRenderTemplateSpy);
        viewWithTemplate.renderTemplateDefer('foo', 'bar');
        clock.tick(1);
        clock.restore();
        ok(spyOnRenderTemplateSpy.calledOnce, 'render:template event fires');
        ok(spyOnRenderTemplateSpy.calledWithMatch(viewWithTemplate, 'a'), 'render:template callback called with expected arguments');
        strictEqual(spyOnRenderTemplateSpy.args[0][2][0], 'foo', 'renderTemplate called with matching first argument');
        strictEqual(spyOnRenderTemplateSpy.args[0][2][1], 'bar', 'renderTemplate called with matching second argument');
        clock.restore();

        var viewWithTemplate = new ViewWithTemplate();
        var spyOnRenderTemplateSpy = sinon.spy();
        var clock = sinon.useFakeTimers();
        viewWithTemplate.on('render:template', spyOnRenderTemplateSpy);
        viewWithTemplate.renderTemplateDebounce('bar', 'foo');
        viewWithTemplate.renderTemplateDebounce('foo', 'bar');
        clock.tick(1);
        clock.restore();
        ok(spyOnRenderTemplateSpy.calledOnce, 'render:template event fires');
        ok(spyOnRenderTemplateSpy.calledWithMatch(viewWithTemplate, 'a'), 'render:template callback called with expected arguments');
        strictEqual(spyOnRenderTemplateSpy.args[0][2][0], 'foo', 'renderTemplate called with matching first argument');
        strictEqual(spyOnRenderTemplateSpy.args[0][2][1], 'bar', 'renderTemplate called with matching second argument');
        clock.restore();
    });
    */
})();
