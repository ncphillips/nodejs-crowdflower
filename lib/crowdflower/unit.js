var rest = require("./rest.js");
var Q = require("q");

/**
 * Unit
 * @param apiKey
 * @param jobId
 * @returns {*}
 * @constructor
 */
var Unit = function(apiKey, jobId){
    if(apiKey && jobId) {
        /**
         * The function begins by `[[prototype]]` linking `this` to `Job.prototype`.
         */
        if (!(this.__proto__ === Unit.prototype)) {
            this.__proto__ = Unit.prototype;
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


        /**
         * READ-ONLY Properties
         * results
         * updated_at
         * created_at
         * judgments_count
         * id
         */
        var readOnlyProperties = ['results', 'updated_at', 'created_at',  'judgments_count', 'id'];

        readOnlyProperties.forEach(
            function(name, index, array){
                // Get each Read-Only properties.
                var prop = Object.getOwnPropertyDescriptor(this, name);

                if(!prop) {
                    prop = {}
                }

                prop.writable = false;

                Object.defineProperty(this, name, prop);

            }.bind(this)
        );


        if(this.id) {
            return Object.create(this);
        }
        else{
            return this;
        }
    }
    throw new Error("Could not create object. Either the API Key, or job ID are missing.");
};

/**
 * Generates the HTTP body from the units modified properties.
 */
Object.defineProperty(Unit.prototype, 'body', {
    'get': function () {
        var keys = Object.keys(this);
        var body = '';
        var value = [];
        for(var i in keys) {
            if (this.hasOwnProperty(keys[i])) {
                if (typeof this[keys[i]] === "object") {
                    var subObj = this[keys[i]];
                    var subkeys = Object.keys(subObj);
                    var subvalue = [];
                    for (var j in subkeys) {
                        subvalue[j] = encodeURIComponent(subObj[subkeys[j]]);
                        body += 'unit[' + keys[i] + '][' + subkeys[j] + ']=' + subvalue[j] + '&'
                    }
                }
                else {
                    value[i] = encodeURIComponent(this[keys[i]]);
                    body += 'unit[' + keys[i] + ']=' + value[i] + '&';
                }
            }
        }
        body += 'key=' + this.apiKey;
        return body;
    }
});

/**
 * Update
 * @returns {*}
 * Promises to return a Unit object.
 */
Unit.prototype.update = function(){
    var path;
    var body = this.body;

    /**
     * Creat Unit
     *
     * If the endpoint is `undefined` then this unit has never actually been
     * uploaded
     */
    if(this.endpoint === undefined){
        path = "/v1/jobs/" + this.jobId + "/units?";
        return rest.makePostRequest(path, body, null).then(
            handleUnitJsonRepresentation.bind(this)
        );
    }

    /**
     * Update unit
     *
     * Since the endpoint is not `undefined`, we are simply updating it.
     */
    else{
        path = this.endpoint + "?";
        return rest.makePutRequest(path, body).then(
            handleUnitJsonRepresentation.bind(this)
        )
    }
};

/**
 * Delete
 * @returns Q.promise
 * Promises to return a JSON message.
 */
Unit.prototype.delete = function (){
    if (!this.endpoint){
        throw new Error("Cannot delete unit. Missing unit id.")
    }
    var path = this.endpoint + "?";
    return rest.makeDeleteRequest(path, this.body)
        .then(
        rest.handleJsonResponse
    );
};


/**
 * @todo
 */
Unit.prototype.split = function () {

};


/**
 * @returns {*}
 */
Unit.prototype.cancel = function () {
    if (!this.endpoint){
        throw new Error("Cannot request cancel operation. Missing job id.")
    }

    var path = this.endpoint + "/cancel?key=" + this.apiKey;

    return rest.makeGetRequest(path);
};


/**
 *
 * @param jsonString
 * A Unit string, usually received from Crowdflower.
 * @returns {*}
 * Returns a Unit object constructed from the parsed `jsonString`.
 */
var handleUnitJsonRepresentation = function(jsonString){
    var unit = JSON.parse(jsonString);
    unit = Unit.call(unit, this.apiKey, this.jobId);

    if (unit.error){
        throw new Error(unit.error.message);
    }
    else if(unit.errors){
        throw new Error(unit.errors);
    } else {
            return unit;
    }
};


module.exports = Unit;
