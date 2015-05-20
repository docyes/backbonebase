(function() {
    module('BackboneBase.Collection', {
        setup: function() {
        }
    });

    test('duplicate', 6, function() {
        var collection = new BackboneBase.Collection([{index: 1, a: 'a1'}, {index: 2, a: 'a2'}]);
        var collectionDupe = collection.duplicate({comparator: 'index'});
        equal(collectionDupe.length, 2, 'length is the same as original collection');
        equal(collectionDupe.at(0).get('a'), 'a1', 'first model has the same value as the origin collection first model');
        equal(collectionDupe.at(1).get('a'), 'a2', 'second model has the same value as the origin collection second model');
        notEqual(collectionDupe.at(0), collection.at(0), 'first models are not the same reference');
        notEqual(collectionDupe.at(1), collection.at(1), 'second models are not the same reference');
        strictEqual(collectionDupe.comparator, 'index', 'passed in option was respected'); 
    });

    test('reverse', 2, function() {
        var collection = new BackboneBase.Collection([{a: 'a1'}, {a: 'a2'}]);
        collection.reverse();
        equal(collection.at(0).get('a'), 'a2', 'first model has been reversed');
        equal(collection.at(1).get('a'), 'a1', 'second model has been reversed');
    });
})();
