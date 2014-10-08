var rest = require("./rest.js");
var Q = require("q");

/**
 * Judgments
 * @param apiKey
 * @param jobId
 * @returns {*}
 * @constructor
 */
var Judgment = function(apiKey, jobId){
    if(apiKey && jobId) {
        /**
         * The function begins by `[[prototype]]` linking `this` to `Job.prototype`.
         */
        if (!(this.__proto__ === Judgment.prototype)) {
            this.__proto__ = Judgment.prototype;
        }

        /**
         * endpoint
         * @type {String||undefined}
         * If this unit already exists on the Crowdflower servers–it has an id
         * property–than this variable contains a string with the REST Endpoint
         * for this job; otherwise, it is `undefined`.
         */
        var endpoint = (this.id === undefined) ? (undefined) : ("/v1/jobs/" + jobId + "/units/" + this.id);

        /** Non-enumerable properties. */
        Object.defineProperty(this, 'apiKey', {'value': apiKey});
        Object.defineProperty(this, 'endpoint', {'value': endpoint});
        Object.defineProperty(this, 'jobId', {'value': jobId});

        if(this.id) {
            return Object.create(this);
        }
        else{
            return this;
        }
    }
    throw new Error("Could not create object. Either the API Key, or job ID are missing.");
};



module.exports = Judgment;
