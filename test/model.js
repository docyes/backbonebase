(function() {
    module('BackboneBase.Model', {
        setup: function() {
        }
    });

    test('getters', 6, function() {
        var model = new BackboneBase.Model();
        strictEqual(model.getter('foo'), undefined, 'no attribute returns undefined'); 
       
        var Model = BackboneBase.Model.extend({
            getters: {
                num: function(attr, value) {
                    return parseInt(value, 10);
                },
                bool: 'bool'
            },
            bool: function(attr, value) {
                if (value==1) {
                    return true;
                }
                return false;
            }
        });
        var model = new Model({num: '10', str: 'abcd', bool: 1});
        strictEqual(model.getter('num'), 10, 'attribute with accessor was invoked with expected value');
        strictEqual(model.getter('str'), 'abcd', 'attribute with no accessor preserves value');
        strictEqual(model.getter('bool'), true, 'attribute with named accessor was invoked with expected value');
    
        var Model = BackboneBase.Model.extend({
            getters: function() {
                return {
                    foo: function() {
                        return 'bar';
                    }
                }
            }
        });
        var model = new Model({});
        equal(model.getter('foo'), 'bar', 'getters defined as a function that returns an object respected');
        
        var model = new Model({}, {
            getters: {
                foo: function() {
                    return 'bar';
                }
            }
        });
        var model = new Model({});
        equal(model.getter('foo'), 'bar', 'getters passed in via constructor are honored');
    });

    test('setters', 6, function() {
        var model = new BackboneBase.Model();
        strictEqual(model.setter('foo', 'bar').get('foo'), 'bar', 'no matching setter sets attribute to expected value.'); 

        var Model = BackboneBase.Model.extend({
            setters: {
                num: function(attr, value) {
                    return parseInt(value, 10);
                },
                bool: 'bool'
            },
            bool: function(attr, value) {
                if (value==1) {
                    return true;
                }
                return false;
            }
        });        
        var model = new Model();
        strictEqual(model.setter('num', '10').get('num'), 10, 'attribute with accessor was invoked with expected value');
        strictEqual(model.setter('str', 'abcd').get('str'), 'abcd', 'attribute with no accessor preserves value');
        strictEqual(model.setter('bool', 1).get('bool'), true, 'attribute with named accessor was invoked with expected value');
 
        var Model = BackboneBase.Model.extend({
            setters: function() {
                return {
                    foo: function(attr, value) {
                        return value;
                    }
                }
            }
        });
        var model = new Model({});
        equal(model.setter('foo', 'bar').get('foo'), 'bar', 'setters defined as a function that returns an object respected');

        var model = new Model({}, {
            setters: {
                foo: function(attr, value) {
                    return 'bar';
                }
            }
        });
        var model = new Model({});
        equal(model.setter('foo', 'bar').get('foo'), 'bar', 'setters passed in via constructor are honored');
    });

    test('reset', 3, function() {
        var model = new BackboneBase.Model({a: 'a', b: 'b'});
        var spyOnAttrChange = sinon.spy();
        model.on('change:a change:b', spyOnAttrChange);
        model.reset({a: 'a2'});
        strictEqual(model.get('a'), 'a2', 'first attribute set to new value');
        strictEqual(model.get('b'), undefined, 'second attribute unset');
        equal(spyOnAttrChange.callCount, 1, 'was only called once');
    });

})();
