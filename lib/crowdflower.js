var rest = require('./crowdflower/rest.js');
var Job = require('./crowdflower/job.js');
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


Crowdflower.prototype.createJob = function(template) {
    var job = Job.call(template, this.apiKey);
    if (job){
        return job.update();
    }
};


Crowdflower.prototype.fetchAllJobs = function() {
    var apiKey = this.apiKey;
    var path = '/v1/jobs?key=' + apiKey;

    var constructJobs = function(data){
        var jobs = JSON.parse(data);
        for (var i = 0; i < jobs.length; i++) {
            jobs[i] = Job.call(jobs[i], apiKey);
        }
        return jobs;
    };

    return rest.makeGetRequest(path).then( constructJobs );
};


Crowdflower.prototype.fetchJob = function (jobId) {
    var apiKey = this.apiKey;
    var path = '/v1/jobs/' + jobId + '?key=' + apiKey;

    var constructJob = function(data){
        var job = JSON.parse(data);
        if(job.error){
            throw new Error(job.error.message);
        }
        job = Job.call(job, apiKey);
        return job;
    };

    return rest.makeGetRequest(path).then( constructJob );

};

