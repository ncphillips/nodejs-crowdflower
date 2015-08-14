/* jslint node: true */
"use strict";
/**
 * URL encodes an object into the format Crowdflower expects.
 * @param object
 * @param prefices
 * @returns {string}
 */
function crowdflowerUrlEncode(object, prefices){
    var keys = Object.keys(object);
    var body = '';
    var values = [];
    prefices = prefices ? prefices : [];
    for (var i in keys) {
        if (object.hasOwnProperty(keys[i])) {
            var part = '';
            if (typeof object[keys[i]] === "object" && object[keys[i]] != null) {
                var subPrefix = '[' + keys[i] + ']';
                var subPrefices = prefices;
                subPrefices.push(subPrefix);
                part = crowdflowerUrlEncode(object[keys[i]], subPrefices);
                subPrefices.pop();
                body += part;
            }
            else {
                values[i] = encodeURIComponent(object[keys[i]]);
                part = prefices.join('') + '[' + keys[i] + ']=' + values[i] + '&';
                body += part;
            }
        }
    }
    return body;
}

module.exports = crowdflowerUrlEncode;
