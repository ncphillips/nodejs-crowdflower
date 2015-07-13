/*jslint node: true*/
"use strict";

/**
 * Define judgment module.
 * @module lib/crowdflower/judgment
 * @requires module: https
 */
var rest = require("./rest.js");
var crowdflowerURLEncode = require("../crowdflowerURLEncode");

/**
 * @constructor
 * @desc Encode API key by encodeURI().
 * @param apikey
 */
var Judgment = function(apikey){
    this.apiKey = encodeURI(apikey);
};

/**
 * Prototype of creating a judgement.
 * @param job_id {String} - The ID of a job.
 * @param judgment_template {object} - The attributes of a judgement.
 * @param callback {function} - A callback function.
 */
Judgment.prototype.create = function(job_id, judgment_template, callback){
    job_id = encodeURI(job_id);
    var path = '/v1/jobs/' + job_id + '/judgments?';
    var body = '?key=' + this.apiKey + '&' + crowdflowerURLEncode(judgment_template);
    rest.makePostRequest(path, body, callback);
};

/**
 * Prototype of updating a judgement.
 * @param job_id {String} - The ID of a job.
 * @param judgment_changes {object} - The attributes of a judgement.
 * @param judgment_id {String} - The ID of a judgement.
 * @param callback {function} - A callback function.
 */
Judgment.prototype.update = function(job_id, judgment_changes, judgment_id, callback){
    job_id = encodeURI(job_id);
    judgment_id = encodeURI(judgment_id);
    var path = '/v1/jobs/' + job_id + '/judgments/' + judgment_id + '?';
    var body = '?key=' + this.apiKey + '&' + crowdflowerURLEncode(judgment_changes);
    rest.makePutRequest(path, body, callback);
};

/*
    two additional param: &page, &limit
 */
/**
 * Prototype of reading a judgement.
 * @param job_id {String} - The ID of a job.
 * @param judgment_id {String} - The ID of a judgement.
 * @param callback {function} - A callback function.
 */
Judgment.prototype.read = function(job_id, judgment_id, callback){
    job_id = encodeURI(jobid);
    judgment_id = encodeURI(judgment_id);
    var path = '/v1/jobs/' + job_id + '/judgments/' + judgment_id +'?';
    path += 'key=' + this.apiKey;
    rest.makeGetRequest(path, callback);
};

/**
 * Prototype of deleting a judgement.
 * @param job_id {String} - The ID of a job.
 * @param judgment_id {String} - The ID of a judgement.
 * @param callback {function} - A callback function.
 */
Judgment.prototype.delete = function(job_id, judgment_id, callback){
    job_id = encodeURI(jobid);
    judgment_id = encodeURI(judgment_id);
    var path = '/v1/jobs/' + job_id + '/judgments/' + judgment_id +'?';
    path += 'key=' + this.apiKey;
    rest.makeDeleteRequest(path, callback);
};

module.exports = Judgment;
