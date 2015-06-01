(function() {
    module('BackboneBase.Request', {
        setup: function() {
            this.Model = Backbone.Model.extend({});
            _.extend(this.Model.prototype, BackboneBase.Request);
        }
    });

    test('stub', 1, function() {
        ok(true, 'worked');
    });
})();

