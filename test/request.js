(function() {
    module('BackboneBase.Request', {
        setup: function() {
            var requests = this.requests = [];
            this.Model = Backbone.Model.extend({});
            _.extend(this.Model.prototype, BackboneBase.Request);
            this.xhr = sinon.useFakeXMLHttpRequest();  
            this.xhr.onCreate = function(xhr) {
                requests.push(xhr);
            };
        },
        
        teardown: function() {
            this.xhr.restore();
        }
    });

    test('stub', 1, function() {
        ok(true, 'worked');
    });

})();

