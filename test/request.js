(function() {
    module('BackboneBase.Request', {
        setup: function() {
            var requests = this.requests = [];
            this.Collection = Backbone.Collection.extend({url: 'https://api.github.com/repos/docyes/backbonebase/commits'});
            _.extend(this.Collection.prototype, BackboneBase.Request);
            this.xhr = sinon.useFakeXMLHttpRequest();  
            this.xhr.onCreate = function(xhr) {
                requests.push(xhr);
            };
        },
        
        teardown: function() {
            this.xhr.restore();
        }
    });

    test('enqueue', 1, function() {
        var collection = new this.Collection();
        var successArgs;
        var successCallback = function() {
            successArgs = arguments;
        };
        collection.enqueueFetch({
            data: {req: 1},
            success: successCallback
        });
        collection.enqueueFetch({
            data: {req: 2}}
        );
        equal(this.requests.length, 1, 'only one request other in queue');
    });

})();

