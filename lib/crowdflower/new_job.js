var rest = require("./rest.js");
var async = require("async");

var jobs_endpoint = "/v1/jobs";

var Job  = function (api_key){
    if(api_key) {
        if (!(this.__proto__ === Job.prototype)) {
            this.__proto__ = Job.prototype;
        }
        // Job Endpoint
        var endpoint = (this.id === undefined) ? (undefined) : (jobs_endpoint + "/" + this.id);

        // Each of the following properties is defined, but not enumerable,
        // so they wont show up when creating the body.
        Object.defineProperty(this, 'apiKey', {'value': api_key});
        Object.defineProperty(this, 'endpoint', {'value': endpoint});

        return Object.create(this);
    }
    else{
        return {"error": "Missing API key"};
    }

};

/*
 * The body property returns a string containing the properties of the
 * job that have been changed.
 */
Object.defineProperty(Job.prototype, 'body', {
    'get': function () {
        //console.log(this.__proto__);
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

    // Scope of function definition chosen so the callback passed in is what
    // gets called.
    var refresh = function (err, data) {
        if(err){
            console.log("Error: " + err);
        }
        else {
            console.log("Data: " + data);
            var job = JSON.parse(data);
            job = Job.call(job, apiKey);
            callback(job);
        }
    };

    // Create new object on Crowdflower end.
    if(this.endpoint === undefined){
        path = jobs_endpoint + "?";
        async.waterfall([
            rest.makePostRequest.bind(null, path, body, null),
            refresh
        ]);
    }

    // Update existing object.
    else{
        path = this.endpoint + "?";
        console.log(path);
        async.waterfall([
            rest.makePutRequest.bind(null, path, body),
            refresh
        ]);
    }
};

Job.prototype.delete = function (callback){
    console.log("Deleting job.");
    if(typeof this.id === undefined){
        console.log("No ID present, cannot delete object.");
    }
    else{
        console.log("Deleting job: " + this.id);
        var path = jobs_endpoint + "/" + this.id;
        rest.makeDeleteRequest(path, this.body, callback);
    }
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
