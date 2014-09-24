var rest = require("./crowdflower/rest.js");
var Job = require("./crowdflower/new_job.js");
var async = require("async");


/**
 *
 * @param api_key
 * @constructor
 * @code
 *
 * var cf = new Crowdflower(my_api_key);
 *
 * cf.jobs;
 *
 * cf.create_job(
 *
 * @endcode
 */

module.exports = Crowdflower;

function Crowdflower(api_key){
    console.log("Creating Crowdflower object.");

    // API KEY
    if (api_key) {
        this.api_key = api_key;
    }
    console.log("API KEY: " + this.api_key);

    // Jobs
    this.jobs = load_jobs(this.api_key);
    async
    /**
     * Create Job
     * @param {obj|null} job
     * @returns {obj}
     *
     * Creates a new job and saves it to Crowdflower.
     * @code
     * cf = new Crowdflower(my_key);
     * job_1 = cf.create_job();
     * console.log(my_job);
     * {
     *   id: 123456,
     *   ... etc
     * }
     *
     * job_template = {
     *      "title": "My second job",
     *      "css": ".span {color: red;}"
     * }
     * job_2 = cf.create_job(job_template);
     * console.log(job_2);
     * >> {
     *      "id": 123457,
     *      "title": "My second job",
     *      "css": ".span {color: red;}"
     *    }
     *
     * @endcode
     */
    this.create_job = function(job) {
        job = typeof job === undefined ? job : {};
        job.api_key = this.api_key;
        job = Job.call(job);
        job.update();
        return job;
    };

    /**
     * Refresh
     *
     * @returns {Crowdflower}
     *
     * Recreates the Crowdflower object, which refreshes the Jobs list.
     */
    this.refresh = function(){
        /** @todo Make sure this refresh makes sense. */
        if (this.jobs){
            Crowdflower.call(this);
        }
        else{
            console.log("Out of sync. Aborting refresh.");
        }
    };
}

// Job request View
function load_job(job_id){
    job = {};
    // Load job somehow.
    job_values.api_key = this.api_key;
    return Job.bind(job)
}

/**
 * load_jobs
 * @param {string|undefined} api_key
 * @returns {Array}
 */
function load_jobs(api_key){
    console.log("Loading jobs for API KEY: " + api_key);
    var path = "/v1/jobs?key=" + api_key;
    var jobs = [];

    rest.makeGetRequest(path, function(data){
        jobs = JSON.parse(data);
        console.log("Number of Jobs: " + jobs.length);
        for(var i = 0; i < jobs.length; i++){
            jobs[i] = Job.call(jobs[i]);
        }
    });

    return jobs;
}

var cf = new Crowdflower("fs7ty7V1mNwTCgsFVy_E");
console.log(cf.jobs);
