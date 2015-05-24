// Todo(Joshua): Accomodate transformations from nested to nested (not just flat to nested and flat to flat)
/**
 * Transforms a source object according to a mapping object
 *
 * mapping = {
 *    sourceKey1: 'destProp.nestedDestProp1',
 *    sourceKey2: 'destProp.nestedDestProp2.reallyNestedProp'
 *    sourceKey3: 'destProp.nestedDestProp2.reallyNestedProp'
 * }
 *
 * turns this:
 *
 * { sourceKey1: 1, sourceKey2: 'first', sourceKey3: 'second' }
 *
 * into this:
 *
 * {
 *    destProp: {
 *        nestedDestProp1: 1,
 *        nestedDestProp2: {
 *            reallyNestedProp: 'first second'
 *        }
 *    }
 * }
 */
module.exports = function transform(source, mapping) {
    var result = {};

    // For each transformation, get the source value and insert it
    // into the appropriate path in the result object
    for (var key in mapping) {

        // Transformations without a destination will be dropped
        if (source[key] && mapping[key]) {

            // Walk through the formatted object, building the
            // nested object structure as necessary
            var path = mapping[key].split('.');
            var ref = result;
            for (var i = 0; i < path.length - 1; i++) {
                ref[path[i]] = ref[path[i]] || {};
                ref = ref[path[i]];
            }

            // If there's already a saved value, concatenate with space
            if (ref[path[path.length-1]]) {
                ref[path[path.length-1]] += ' ' + source[key];

                // Otherwise, store the source value
            } else {
                ref[path[path.length - 1]] = source[key];
            }
        }
    }

    return result;
};