(function() {
    module('BackboneBase.Model', {
        setup: function() {
        }
    });
    test('Object', 1, function() {
        var model = new BackboneBase.Model();
        ok(model, 'model exists');
    });
})();
