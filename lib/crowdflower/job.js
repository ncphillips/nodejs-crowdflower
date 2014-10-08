var rest = require("./rest.js");
var fs = require("fs");
var Q = require("q");
var Unit = require("./unit.js");
var Judgment = require("./judgment.js");
var querystring = require('querystring');


/**
 * The REST endpoint for `jobs` in the Crowdflower API.
 * @type {string}
 */
var jobs_endpoint = "/v1/jobs";


/**
 * `Jobs`
 *
 * @param api_key
 * @returns {*}
 * @constructor
 *
 * Although `Job` is a constructor function, this API rarely uses it in conjuction
 * with the `new` operator. Instead, `Job.call(existingObject, apiKey)` alters the
 * `[[prototype]]` chain of the `existingObject` fetched from the Crowdflower API. It
 * then `[[prototype]]` links an empty object to the fetched one to keep track
 * of any changes made using this API. The resulting prototype chain will be as follows:
 *
 *      Job.prototype   isPrototypeOf   CrowdflowerJob
 *
 *      CrowdflowerJob isPrototypeOf {}
 *
 * If the Job being loaded created is a new job, not yet saved on the Crowdflower
 * API, then the middle object is taken out and the prototype chain looks like this:
 *
 *      Job.prototype isPrototypeOf {}
 */
var Job  = function (api_key){
    if(api_key) {
        /**
         * The function begins by `[[prototype]]` linking `this` to `Job.prototype`.
         */
        if (!(this.__proto__ === Job.prototype)) {
            this.__proto__ = Job.prototype;
        }

        /**
         * endpoint
         * @type {String||undefined}
         * If this job already exists on the Crowdflower servers–it has an id
         * property–than this variable contains a string with the REST Endpoint
         * for this job; otherwise, it is `undefined`.
         */
        var endpoint = (this.id === undefined) ? (undefined) : (jobs_endpoint + "/" + this.id);

        /** Non-enumerable properties. */
        Object.defineProperty(this, 'apiKey', {'value': api_key});
        Object.defineProperty(this, 'endpoint', {'value': endpoint});

        /**
         * READ-ONLY Properties
         *
         * completed,
         * completed_at,
         * created_at,
         * crowd_costs,
         * gold,
         * golds_count,
         * id,
         * judgments_count,
         * state,
         * units_count,
         * updated_at,
         */
        var readOnlyProperties = [ 'completed', 'completed_at', 'created_at',
            'crowd_costs', 'gold', 'golds_count', 'id', 'judgments_count',
            'state', 'units_count', 'updated_at' ];

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
};


/**
 * Constructs URI string from the `Job`'s modified properties.
 * @returns String
 */
Object.defineProperty(Job.prototype, 'body', {
    'get': function () {
        var keys = Object.keys(this);
        var body = '';
        var value = [];
        for(var i in keys) {
            // This prevents unchanged variables from being added to the body.
            if (this.hasOwnProperty(keys[i])) {
                value[i] = encodeURIComponent(this[keys[i]]);
                body += 'job[' + keys[i] + ']=' + value[i] + '&';
            }
        }
        body += 'key=' + this.apiKey;
        return body;
    }
});


/**
 * Update
 * Makes a PUT or POST request to the Crowdflower API to update/create this `Job`.
 *
 * @returns Q.promise
 * Promises to return the updated Job.
 */
Job.prototype.update = function (){
    var path;
    var body = this.body;

    // Create new object on Crowdflower end.
    if(this.endpoint === undefined){
        path = "/v1/jobs?";
        return rest.makePostRequest(path, body, null)
            .then(
            handleJobJsonRepresentation.bind(this)
        );
    }

    // Update existing object.
    else{
        path = this.endpoint + "?";
        return rest.makePutRequest(path, body).then(
            handleJobJsonRepresentation.bind(this)
        );
    }
};


/**
 * Makes a DELETE request to the Crowdflower API to delete this Job.
 * @returns Q.promise
 * Promises to return a message object from the Crowdflower API.
 */
Job.prototype.delete = function (){
    if (!this.endpoint){
        throw new Error("Cannot delete job. Missing job id.")
    }
    var path = this.endpoint + "?";
    return rest.makeDeleteRequest(path, this.body)
        .then(
        rest.handleJsonResponse
        );
};


/**
 * Upload a JSON file containing Unit objects to this job.
 * @param filePath
 * @param force
 * @returns Q.promise
 * Promises to return this Job once the upload is completd.
 */
Job.prototype.upload = function (filePath, force){
    if (!this.endpoint){
        throw new Error("Cannot upload file. Missing job id.");
    }

    var contentType= 'application/json';
    var path = this.endpoint + "/upload?key=" + this.apiKey;
    if(force){
        force = force.toString();
        path += "&force=" + force;
    }

    /** @todo Put the file reading part of Job.prototype.upload in a separate function. */
    // Promise starts with reading the file's content before posting.
    var defer = Q.defer();
    fs.readFile(filePath, 'utf8', function(err, fileContent) {
        if(err){
            defer.reject(err);
        }
        else{
            defer.resolve(fileContent);
        }
    });

    // and then post the file's content to Crowdflower's API.
    return defer.promise

        .then(
        function(fileContent){
            return rest.makePostRequest(path, fileContent, contentType)
        })

        .then(
        handleJobJsonRepresentation.bind(this)
        );
};


/**
 * Creates a new job on the Crowdflower servers that is copy of this job.
 * @param allUnits
 * @param gold
 * @returns Q.promise
 * Promises to return a new job, which is a copy of this job.
 */
Job.prototype.copy = function (allUnits, gold){
    /**
     * @todo Test this function once the Units access has been added.
     */
    if(!this.endpoint) {
        throw new Error("Cannot request `copy` operationg. Missing job id.");
    }

    var path = this.endpoint + "/copy?key=" + this.apiKey;

    if (allUnits) {
        path += "&allunits=true";
    }
    else if (gold) {
        path += "&gold=true";
    }

    return rest.makeGetRequest(path)
        .then(
        handleJobJsonRepresentation.bind(this)
    );
};


/**
 * Pauses this job.
 * @see jobOperation
 * @returns {*}
 * Promises to return an application response.
 */
Job.prototype.pause = function (){
    return jobOperation.call(this, "pause")
        .then(
        rest.handleApplicationResponse
    );
};


/**
 * Resumes this job.
 * @see jobOperation
 * @returns {*}
 * Promises to return an application response.
 */
Job.prototype.resume = function (){
    return jobOperation.call(this, "resume").then(
        rest.handleApplicationResponse
    );
};


/**
 * Cancel's this job.
 * @see jobOperation
 * @returns {*}
 * Promises to return an application response.
 */
Job.prototype.cancel = function (){
    return jobOperation.call(this, "cancel").then(
        rest.handleApplicationResponse
    );
};


/**
 *
 * @returns {*}
 * Promises to return the Job's status.
 */
Job.prototype.status = function (){
    return jobOperation.call(this, "ping").then(
        rest.handleJsonResponse
    );
};


/**
 *
 * @returns {*}
 * Promises to return the Job's legend.
 */
Job.prototype.legend = function (){
    return jobOperation.call(this, "legend")
        .then(
        rest.handleJsonResponse
    );
};


/**
 *
 * @param unitId
 * @returns {*}
 * Promises to return a Unit.
 */
Job.prototype.fetchUnit = function (unitId) {
    if(!this.endpoint){
        throw new Error("Job ID missing. Cannot perform request.");
    }

    var apiKey = this.apiKey;
    var jobId = this.id;
    var path = this.endpoint + '/units/' + unitId + '?key=' + apiKey;

    var constructUnit = function(data){
        var unit = JSON.parse(data);
        if(unit.error){
            throw new Error(unit.error.message);
        }
        return Unit.call(unit, apiKey);
    };

    // Fetch unit string, then construct  a new Unit from it.
    return rest.makeGetRequest(path).then( constructUnit );

};


/**
 *
 * @returns {*}
 * Promises to return an array of Units.
 */
Job.prototype.fetchAllUnits = function() {
    /** @todo I hate everything about this function */
    if(!this.endpoint){
        throw new Error("Job ID missing. Cannot perform request.");
    }

    var apiKey = this.apiKey;
    var jobId = this.id;
    var path = this.endpoint + '/units?key=' + apiKey;

    var constructUnits = function(data){
        var unitsObject = JSON.parse(data);
        var units = [];
        var unit;

        var constructUnit = function(unitId, index, array){
            unit = unitsObject[unitId];
            unit.unitId = unitId;
            units.push(Unit.call(unit, apiKey, jobId));
        };

        /** Each key in the unitsObject is the id of a unit. */
        var unitIds = Object.getOwnPropertyNames(unitsObject);

        unitIds.forEach(
            constructUnit
        );

        return units;
    };

    // Fetch units-string then construct each Unit from it.
    return rest.makeGetRequest(path).then( constructUnits );
};


/**
 *
 * @param template
 * @returns {*}
 * Promises to return a Unit.
 */
Job.prototype.createUnit = function(data) {
  var unit = {
    data: (data?data:{}),
    job_id: this.id
  };

  unit = Unit.call(unit, this.apiKey);
  if(unit){
    return unit.update();
  }
};


Job.prototype.fetchJudgment = function(judgmentId){
    var path = this.endpoint + "/judgments/" + judgmentId + "?key=" + this.apiKey;
    return rest.makeGetRequest(path).then(rest.handleJsonResponse);
};

Job.prototype.fetchAllJudgments = function () {
    /** @todo I hate everything about this function */
    if(!this.endpoint){
        throw new Error("Job ID missing. Cannot perform request.");
    }

    var apiKey = this.apiKey;
    var jobId = this.id;
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


Job. prototype.channels = function () {
    var path = this.endpoint + "/channels?key=" + this.apiKey;
    return rest.makeGetRequest(path).then( rest.handleJsonResponse );
};

/**
 * Sends a requests to the Crowdflower API to perform an operation on this job.
 * @param operation
 * @returns {*}
 */
var jobOperation = function(operation){
    if (!this.endpoint){
        throw new Error("Cannot request `" + operation + "` operation. Missing job id.")
    }

    var path = this.endpoint + "/" + operation + "?key=" + this.apiKey;

    return rest.makeGetRequest(path);
};


/**
 *
 * @param jsonString
 * @returns {*}
 *
 * This function must always be bound to the `Job` that
 */
var handleJobJsonRepresentation = function(jsonString) {
    var job = JSON.parse(jsonString);
    job = Job.call(job, this.apiKey);

    if (job.error){
        throw new Error(job.error.message);
    } else if (job.errors){
        throw new Error(job.errors);
    }
    else{
        return job;
    }
};


/*
 Read-Write Properties
     after_gold
     alias
     auto_order_threshold
     auto_order_timeout
     auto_order
     cml
     confidence_fields
     css
     design_verified
     excluded_countries
     execution_mode
     expected_judgments_per_unit
     fields
     gold_per_assignment
     include_unfinished
     included_countries
     instructions
     js
     judgments_per_unit
     low_needed_tasks_reservation_takeover
     max_judgments_per_ip
     max_judgments_per_unit
     max_judgments_per_worker
     min_unit_confidence
     minimum_account_age_seconds
     minimum_requirements
     options
     pages_per_assignment
     payment_cents
     problem
     public_data
     require_worker_login
     send_judgments_webhook
     support_email
     title
     units_per_assignment
     units_remain_finalized
     uri
     variable_judgments_mode
     webhook_uri
 */

module.exports = Job;
