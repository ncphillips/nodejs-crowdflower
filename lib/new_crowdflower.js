var rest = require('./crowdflower/rest.js');
var Job = require('./crowdflower/new_job.js');
var async = require('async');


/**
 *
 * @param apiKey
 * @constructor
 */
module.exports = Crowdflower;

function Crowdflower(apiKey){
    // API KEY
    if (apiKey) {
        this.apiKey = apiKey;
    }

}

/**
 * Create Job
 * @param callback
 * @returns {Job}
 *
 * Creates a Job object and sends it to Crowdflower.
 * @see Job
 * @see Job.update
 */
Crowdflower.prototype.createJob = function(callback) {
    var job = new Job(this.apiKey);

    job.update(callback);

    return job;
};

/**
 * Fetch Jobs
 * @param callback
 *
 * Fetches Job JSON from
 */
Crowdflower.prototype.fetchJobs = function(callback) {
    // Function defined outside the scope of async.waterfall so
    // the `callback` function referenced is the one passed
    // in by the user.
    var passJobsToUserFunction = function(jobs){
        callback(null, jobs);
    };

    var path = '/v1/jobs?key=' + this.apiKey;

    async.waterfall([

        // Fetch objects from Crowdflower
        rest.makeGetRequest.bind(null, path),

        // Parse JSON string and create Jobs.
        function(data, callback){
            jobs = JSON.parse(data);
            for (var i = 0; i < jobs.length; i++) {
                jobs[i] = Job.call(jobs[i], this.apiKey);
            }
            callback(null, jobs);
        }.bind(this),

        // Runs the callback passed in by the caller.
        callback
    ]);
};

Crowdflower.prototype.fetchJob = function (jobId, callback) {
    var passJobToUserFunction = function(job){
        callback(null, job);
    };

    var path = '/v1/jobs/' + jobId + '?key=' + this.apiKey;

    async.waterfall([

        // Fetch objects from Crowdflower
        rest.makeGetRequest.bind(null, path),

        // Parse JSON string and create Jobs.
        function(data, callback){
            var job = JSON.parse(data);
            job = Job.call(job, this.apiKey);
            callback(null, job);
        }.bind(this),

        // Runs the callback passed in by the caller.
        callback
    ]);


};

// Test code.


//cf.fetchJobs(function(jobs){
//    for(var i = 0; i < jobs.length; i++){
//        console.log(jobs[i].id);
//        console.log(jobs[i].update);
//    }
//});

cf.fetchJob(617545, function(job){
    console.log(job.title);
    job.title = "I have changed the title.";
    job.update(function(job){console.log(job)});
});
