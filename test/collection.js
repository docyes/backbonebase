(function() {
    module('BackboneBase.Collection', {
        setup: function() {
        }
    });

    test('Object', 1, function() {
        var collection = new BackboneBase.Collection();
        ok(collection);
    });

})();
