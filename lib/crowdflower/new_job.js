var rest = require("./rest.js");

var jobs_endpoint = "/v1/jobs";

module.exports = function (){
    // API Key
    if(typeof this.api_key === undefined){
        console.log("API Key missing. Could not load job.");
        return null;
    }
    // Job Endpoint
    if (this.id === undefined){
        console.log("Job does not have an id.");
        this.endpoint = undefined;
    }
    else{
        console.log("Generating endpoint for job: " + this.id);
        this.endpoint = jobs_endpoint + "/" + this.id;
    }

    // Requests
    this.update = function (callback){
        if(this.endpoint === undefined){
            console.log("Creating new job.");
            var path = jobs_endpoint + "?";
            rest.makePostRequest(path, this.body, callback);
        }
        else{
            console.log("Updating job: " + this.id);
            var path = this.endpoint + "?";
            //rest.makePutRequest(path, this.body, callback);
        }
    };

    this.delete = function (callback){
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

    // Operations

    this.copy = function (callback){console.log("copy") };
    this.pause = function (){
        console.log(this.id +  " pause");
    };
    this.resume = function (){console.log("resume")};
    this.cancel = function (){console.log("cancel") };
    this.status = function (){console.log("status") };
    this.legend = function (){console.log("legend") };

    /**
     * @property {string} body
     * The HTTP body string representing a job.
     */
    Object.defineProperty(this, 'body', {
        'get': function () {
            console.log("Generating HTTP body from job");

            var keys = Object.keys(this);
            var body = '';
            var value = [];
            for(var i in keys){
                value[i] = encodeURIComponent(this[keys[i]]);
                body += 'job['+keys[i]+']='+value[i]+'&';
            }
            body += 'key=' + this.apiKey;
            return body;
        }
    });




    return this;
};


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