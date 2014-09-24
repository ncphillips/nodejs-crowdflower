var rest = require('./crowdflower/rest.js');
var Job = require('./crowdflower/new_job.js');
var async = require('async');


/**
 *
 * @param api_key
 * @constructor
 */
module.exports = Crowdflower;

function Crowdflower(api_key){
    // API KEY
    if (api_key) {
        this.api_key = api_key;
    }

    // Begin fetching jobs.
    this.fetch_jobs = function(callback) {
        var c = {'callback': callback};
        var path = '/v1/jobs?key=' + this.api_key;

        async.waterfall([
            // Fetch objects
            rest.makeGetRequest.bind(null, path),
            function(data, callback) {
                console.log('');
                var jobs = JSON.parse(data);
                for (var i = 0; i < jobs.length; i++) {
                    jobs[i] = Job.call(jobs[i]);
                }
                this.callback(jobs);
            }.bind(c)
        ]);
    }.bind(this);

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
     *      'title': 'My second job',
     *      'css': '.span {color: red;}'
     * }
     * job_2 = cf.create_job(job_template);
     * console.log(job_2);
     * >> {
     *      'id': 123457,
     *      'title': 'My second job',
     *      'css': '.span {color: red;}'
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
            console.log('Out of sync. Aborting refresh.');
        }
    };
}


var cf = new Crowdflower('fs7ty7V1mNwTCgsFVy_E');
cf.fetch_jobs(function(jobs){
    console.log(jobs);
});

