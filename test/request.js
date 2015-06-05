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

    test('enqueue', 11, function() {
        var collection = new this.Collection();
        var success = sinon.spy();
        var error = sinon.spy();
        collection.enqueueFetch({
            data: {req: 1},
            success: success,
            error: error
        });
        collection.enqueueFetch({
            data: {req: 2}
        });
        collection.enqueueFetch({
            data: {req: 3}
        });
        equal(this.requests.length, 1, 'only one request other in queue');
        this.requests[0].respond(
            200, 
            {"Content-Type": "application/json" },
            '[{ "id": 1, "comment": "Hello world" }]'
        );
        equal(this.requests.length, 2, 'two requests as other completed');
        equal(collection.at(0).id, 1, 'collection first item has expected id');
        equal(success.callCount, 1, 'success callback was called');
        equal(success.getCall(0).args[0], collection, 'first success argument is collection');  
        deepEqual(success.getCall(0).args[1], [{ "id": 1, "comment": "Hello world" }], 'response is as expected');
        deepEqual(success.getCall(0).args[2].data, {req: 1}, 'options were proxied to callback');
        equal(error.callCount, 0, 'error callback was not called');
        this.requests[1].respond(
            200, 
            {"Content-Type": "application/json" },
            '[{ "id": 2, "comment": "Hello world" }]'
        );
        equal(collection.at(0).id, 2, 'collection first item has expected id');
        equal(this.requests[0].url, 'https://api.github.com/repos/docyes/backbonebase/commits?req=1', 'first request was from the first enqueue call');
        equal(this.requests[1].url, 'https://api.github.com/repos/docyes/backbonebase/commits?req=3', 'second request was from the last enqueue call');
    });

})();

