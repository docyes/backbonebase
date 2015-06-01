(function() {
    module('BackboneBase.Request', {
        setup: function() {
            var requests = this.requests = [];
            this.Model = Backbone.Model.extend({url: 'https://api.github.com/repos/docyes/backbonebase/commits'});
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

    test('enqueue', 1, function() {
        var model = new this.Model();
        model.enqueueFetch({data: {req: 1}});
        model.enqueueFetch({data: {req: 2}});
        equal(this.requests.length, 1, 'only one request other in queue');
    });

})();

