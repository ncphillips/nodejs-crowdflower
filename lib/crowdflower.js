var rest = require('./crowdflower/rest.js');
var Job = require('./crowdflower/job.js');
var q = require('q');

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
 *
 * @param template
 * @returns {*}
 * Promises to return a Job.
 */
Crowdflower.prototype.createJob = function(template) {
    var job = Job.call(template, this.apiKey);
    if (job){
        return job.update();
    }
};


/**
 *
 * @returns {*}
 * Promises to return an array of Jobs.
 */
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


/**
 *
 * @param jobId
 * @returns {*}
 * Promises to return a Job.
 */
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


/**
 * @returns {*}
 */
Crowdflower.prototype.account = function(){
    var path = "/v1/account?key=" + this.apiKey;
    return rest.makeGetRequest(path).then(rest.handleJsonResponse);
};

