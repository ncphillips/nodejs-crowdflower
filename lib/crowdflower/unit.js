var rest = require("./rest.js");
var Q = require("q");
var Judgment = require("./judgment.js");

/**
 * Unit
 * @param apiKey
 * @returns {*}
 * @constructor
 */
var Unit = function(apiKey){
    if(apiKey && this.job_id) {

        /**
         * The function begins by `[[prototype]]` linking `this` to `Job.prototype`.
         */
        if (!(this.__proto__ === Unit.prototype)) {
            this.__proto__ = Unit.prototype;
        }

        if(!this.job_id){
          this.job_id = jobId;
        }

        /**
         * endpoint
         * @type {String||undefined}
         * If this unit already exists on the Crowdflower servers–it has an id
         * property–than this variable contains a string with the REST Endpoint
         * for this job; otherwise, it is `undefined`.
         */
        var endpoint = (this.id === undefined ) ? (undefined) :  ("/v1/jobs/" + this.job_id + "/units/" + this.id);

        /** Non-enumerable properties. */
        Object.defineProperty(this, 'apiKey', {'value': apiKey});
        Object.defineProperty(this, 'endpoint', {'value': endpoint});

        return this;
    }
    throw new Error("Could not create object. Either the API Key, or job ID are missing.");
};

/**
 * Generates the HTTP body from the units modified properties.
 */
Object.defineProperty(Unit.prototype, 'body', {
    'get': function () {
       var body = crowdflowerUrlEncode(this, ['unit']);
       body += 'key=' + this.apiKey;
       return body;
    }
});

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
  for (var i in keys) {
    var part = '';
    if (object.hasOwnProperty(keys[i])) {
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

/**
 * Update
 * @returns {*}
 * Promises to return a Unit object.
 */
Unit.prototype.update = function(){
    var path;
    var body = this.body;

    /**
     * Create Unit
     *
     * If the endpoint is `undefined` then this unit has never actually been
     * uploaded
     */
    if(this.endpoint === undefined){
        path = "/v1/jobs/" + this.job_id + "/units?";
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

    return rest.makeGetRequest(path).then(
        rest.handleApplicationResponse
    );
};


Unit.prototype.fetchAllJudgments = function () {
    /** @todo I hate everything about this function */
    if(!this.endpoint){
        throw new Error("Job ID missing. Cannot perform request.");
    }

    var apiKey = this.apiKey;
    var jobId = this.jobId;
    var path = this.endpoint + '/judgments?key=' + apiKey;

    var constructJudgments = function(data){
        var judgmentsObject = JSON.parse(data);
        var judgments = [];
        var judgment;

        var constructUnit = function(judgmentId, index, array){
            judgment = judgmentsObject[judgmentId];
            judgment.id = judgmentId;
            judgments.push(Judgment.call(judgment, apiKey, jobId));
        };

        /** Each key in the unitsObject is the id of a unit. */
        var judgmentIds = Object.getOwnPropertyNames(judgmentsObject);

        judgmentIds.forEach(
            constructUnit
        );

        return judgments;
    };

    // Fetch units-string then construct each Unit from it.
    return rest.makeGetRequest(path).then( constructJudgments );
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

         if(unit.error){  throw new Error(unit.error.message); }
    else if(unit.errors){ throw new Error(unit.errors); }
    else {
           unit = Unit.call(unit, this.apiKey);
            return unit;
    }
};


module.exports = Unit;
