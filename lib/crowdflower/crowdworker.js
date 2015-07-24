/* jslint node: true*/
"use strict";

/**
 * @module
 */
var crowdflowerURLEncode = require('../crowdflowerURLEncode')
var rest = require('./rest');

/**
 *
 * @param apiKey
 * @constructor
 */
var CrowdWorker = function (apiKey) {
    this.apiKey = apiKey;
};

CrowdWorker.prototype.bonus = function (job_id, worker_id, amount, reason, callback) {
    job_id = encodeURI(job_id);
    worker_id = encodeURI(worker_id);
    amount = amount || 1;
    reason = reason || '';
    var path = '/v1/jobs/' + job_id + '/workers/' + worker_id + '/bonus';
    var body = '?key=' + this.apiKey + '&' + crowdflowerURLEncode({amount: amount, reason: reason});
    rest.makePostRequest(path , body, callback);
};

CrowdWorker.prototype.reject = function (job_id, worker_id, callback) {
    job_id = encodeURI(job_id);
    worker_id = encodeURI(worker_id);
    var path = '/v1/jobs/' + job_id + '/workers/' + worker_id + '/reject';
    var body = '?key=' + this.apiKey;
    rest.makePutRequest(path, body, callback);
};

CrowdWorker.prototype.notify = function (job_id, worker_id, message, callback) {
    job_id = encodeURI(job_id);
    worker_id = encodeURI(worker_id);
    message = message || '';
    var path = '/v1/jobs/' + job_id + '/workers/' + worker_id + '/notify';
    var body = '?key=' + this.apiKey + '&' + crowdflowerURLEncode({message: message});
    rest.makePostRequest(path , body, callback);
};

CrowdWorker.prototype.flag = function (job_id, worker_id, reason, persist, callback) {
    job_id = encodeURI(job_id);
    worker_id = encodeURI(worker_id);
    reason = reason || '';
    persist = persist || true;
    var path = '/v1/jobs/' + job_id + '/workers/' + worker_id + '/flag';
    var body = '?key=' + this.apiKey + '&' + crowdflowerURLEncode({reason: reason, persist: persist});
    rest.makePutRequest(path, body, callback);
};

CrowdWorker.prototype.deflag = function (job_id, worker_id, reason, callback) {
    job_id = encodeURI(job_id);
    worker_id = encodeURI(worker_id);
    reason = reason || '';
    var path = '/v1/jobs/' + job_id + '/workers/' + worker_id + '/deflag';
    var body = '?key=' + this.apiKey + '&' + crowdflowerURLEncode({reason: reason});
    rest.makePutRequest(path, body, callback);
};

module.exports = CrowdWorker;


