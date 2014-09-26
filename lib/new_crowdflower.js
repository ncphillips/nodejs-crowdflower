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


Crowdflower.prototype.createJob = function(template, callback) {
    var job = Job.call(template, this.apiKey);
    if (job){
        job.update(callback);
    }
};


Crowdflower.prototype.fetchAllJobs = function(callback) {
    var apiKey = this.apiKey;
    var path = '/v1/jobs?key=' + apiKey;

    var constructJobs = function(data){
        console.log("Creating objects.");
        var jobs = JSON.parse(data);
        for (var i = 0; i < jobs.length; i++) {
            jobs[i] = Job.call(jobs[i], apiKey);
        }
        return jobs;
    };

    return rest.makeGetRequest(path).then( constructJobs );
};


Crowdflower.prototype.fetchJob = function (jobId, callback) {
    var apiKey = this.apiKey;
    var path = '/v1/jobs/' + jobId + '?key=' + apiKey;

    var constructJob = function(data){
        var job = JSON.parse(data);
        job = Job.call(job, apiKey);
        return job;
    };

    return rest.makeGetRequest(path).then( constructJob );

};

// Test code.
var cf = new Crowdflower('fs7ty7V1mNwTCgsFVy_E');


//cf.fetchJobs(function(jobs){
//    for(var i = 0; i < jobs.length; i++){
//        console.log(jobs[i].id);
//        console.log(jobs[i].update);
//    }
//});

//cf.fetchJob(617545, function(job){
//    console.log(job.title);
//    job.title = "I have changed the title.";
//    job.update(function(job){console.log(job)});
//});

//cf.createJob({"title": "Creating a fresh job with initial data."}, function(){
//    console.log("Success");
//});

cf.fetchAllJobs().then(
    function(job){
        console.log(job[0].id);
    }
);

