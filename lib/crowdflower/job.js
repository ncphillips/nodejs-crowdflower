var rest = require("./rest.js");
var async = require("async");

var jobs_endpoint = "/v1/jobs";

var Job  = function (api_key){
    if(api_key) {
        // Force `this` to have the link to Job.prototype
        // This is done because, in the use case of Crowdflower.prototype
        // the object passed in is not created with the `new` operator.
        if (!(this.__proto__ === Job.prototype)) {
            this.__proto__ = Job.prototype;
        }
        // Job Endpoint
        var endpoint = (this.id === undefined) ? (undefined) : (jobs_endpoint + "/" + this.id);

        // Each of the following properties is defined, but not enumerable,
        // so they wont show up when creating the body.
        Object.defineProperty(this, 'apiKey', {'value': api_key});
        Object.defineProperty(this, 'endpoint', {'value': endpoint});

        if(this.id) {
            return Object.create(this);
        }
        else{
            // If the ID is not included, then this is a fresh job
            // and anything done to it should be changed.
            return this;
        }
    }
};

/*
 * The body property returns a string containing the properties of the
 * job that have been changed.
 *
 * The body is not enumberable.
 */
Object.defineProperty(Job.prototype, 'body', {
    'get': function () {
        var keys = Object.keys(this);
        var body = '';
        var value = [];
        for(var i in keys) {
            if (this.hasOwnProperty(keys[i])) {
                // This prevents unchanged variables from being changed.
                value[i] = encodeURIComponent(this[keys[i]]);
                body += 'job[' + keys[i] + ']=' + value[i] + '&';
            }
        }
        body += 'key=' + this.apiKey;
        return body;
    }
});

// Operations
Job.prototype.update = function (callback){
    var path;
    var body = this.body;
    var apiKey = this.apiKey;

    var reconstructJob = function (data) {
        var job = JSON.parse(data);
        return Job.call(job, apiKey);
    };

    // Create new object on Crowdflower end.
    if(this.endpoint === undefined){
        path = jobs_endpoint + "?";
        return rest.makePostRequest(path, body, null).then(reconstructJob);
    }

    // Update existing object.
    else{
        path = this.endpoint + "?";
        return rest.makePutRequest.bind(null, path, body).then(reconstructJob);
    }


};

Job.prototype.delete = function (){
    var path = jobs_endpoint + "/" + this.id;
    return rest.makeDeleteRequest(path, this.body);
};

//Request
Job.prototype.copy = function (callback){console.log("copy") };
Job.prototype.pause = function (){
    console.log(Job.prototype.id +  " pause");
};
Job.prototype.resume = function (){console.log("resume")};
Job.prototype.cancel = function (){console.log("cancel") };
Job.prototype.status = function (){console.log("status") };
Job.prototype.legend = function (){console.log("legend") };


/*
 Properties
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
