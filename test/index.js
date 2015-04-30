(function() {
    module('BaseView', {
        setup: function() {
        }
    });
    test('children', 3, function() {
        var viewConstructorTest = new BaseView({tagName: 'span'});
        ok(!!viewConstructorTest.children, 'constructor creates children instance member');
        
        var ViewChild = BaseView.extend({
            initialize: function() {
               this.children.child = new Backbone.View(); 
            }
        });
        var viewChild = new ViewChild();
        var viewPassedChildConstructorTest = new ViewChild({children: {child2: viewChild}});
        ok(viewPassedChildConstructorTest.children.child instanceof Backbone.View, 'child view created in constructor is correct');
        ok(viewPassedChildConstructorTest.children.child2 instanceof ViewChild, 'child view passed in constructor is correct');
    });
    test('template', 13, function() {
        viewNoTemplateTest = new BaseView();
        strictEqual(viewNoTemplateTest.template, undefined, 'no view template defined');

        viewTemplateConstructorTest = new BaseView({template: 'a'});
        strictEqual(viewTemplateConstructorTest.template, 'a', 'template passed in constructor');

        var ViewWithTemplate = BaseView.extend({template: 'a'});
        var viewWithTemplate = new ViewWithTemplate();
        strictEqual(viewWithTemplate.template, 'a', 'template in class definition');

        viewTemplateConstructorOverrideTest = new ViewWithTemplate({template: 'b'});
        strictEqual(viewTemplateConstructorOverrideTest.template, 'b', 'template based in constructor trumps class definition');

        viewNoRenderTemplate = new BaseView();
        strictEqual(viewNoRenderTemplate.renderTemplate(), '', 'calling renderTemplate with no-existing template definition returns empty string');

        viewDefaultRender = new BaseView();
        strictEqual(viewDefaultRender.render().el, viewDefaultRender.el, 'default render method returns a reference to itself');

        var viewWithTemplate = new ViewWithTemplate();
        strictEqual(viewWithTemplate.renderTemplate(), 'a', 'calling renderTemplate with an existing template is callable and returns an expected value');

        var expectedModuleId = 'Foo_Bar/Bar-Foo';
        var expectedClassName = 'foobar-bar-foo';
        var view = new BaseView();
        strictEqual(view.toClassName(expectedModuleId), expectedClassName, 'conversion of string to safe class name');
        var viewWithModuleId = new BaseView({mid: expectedModuleId, className: 'bar'});
        strictEqual(viewWithModuleId.mid, expectedModuleId, 'Passed in mid is set as instance member');
        strictEqual(viewWithModuleId.$el.attr('data-mid'), expectedModuleId, 'View element data-mid matches view instance mid attribute');
        ok(viewWithModuleId.$el.hasClass(expectedClassName), 'View element class was set to value of data-mid');
        ok(viewWithModuleId.$el.hasClass('bar'), 'View element class argument honored and not destroyed');

        var simpleViewDataCid = new BaseView();
        strictEqual(simpleViewDataCid.cid, simpleViewDataCid.$el.attr('data-cid'), 'View element data-cid matches view instance cid attribute');
    });
})();