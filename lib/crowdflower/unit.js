/* jslint node: true */
"use strict";

/**
 * Define unit module.
 * @module lib/crowdflower/unit
 * @requires module: ./rest.js
 * @requires module: ../crowdflowerURLEncode.js
 */
var rest = require("./rest.js");
var crowdflowerURLEncode = require("../crowdflowerURLEncode");
/**
 * @constructor
 * @desc Encode API key by encodeURI().
 * @param apikey
 */
var Unit = function(apikey){
    this.apiKey = encodeURI(apikey);
};

/**
 * Prototype of getting status of an unit.
 * @param job_id {String} - The ID of a existed job.
 * @param callback {function} - A callback function.
 */
Unit.prototype.getstatus = function(job_id, callback){
    job_id = encodeURI(job_id);
    var path = '/v1/jobs/' + job_id + '/units/ping?key=' + this.apiKey;
    rest.makeGetRequest(path,callback);
};

/**
 * Prototype of canceling an unit.
 * @param job_id {String} - The ID of a existed job.
 * @param unit_id {String} - The ID of an unit.
 * @param callback {function} - A callback function.
 */
Unit.prototype.cancelUnit = function(job_id, unit_id, callback){
    job_id = encodeURI(job_id);
    unit_id = encodeURI(unit_id);
    var path = '/v1/jobs/' + job_id + '/units/' + unit_id + '/cancel?key=' + this.apiKey;
    rest.makePostRequest(path,callback);
};

/**
 * Prototype of creating an unit.
 * @param job_id {String} - The ID of a existed job.
 * @param jsonObject {object} - The attributes of unit.
 * @param callback {function} - A callback function.
 */
Unit.prototype.createUnit = function(job_id, jsonObject, callback){
    job_id = encodeURI(job_id);
    var keys = Object.keys(jsonObject);
    var path = '/v1/jobs/' + job_id + '/units?';
    var body = '?key=' + this.apiKey + '&' + crowdflowerURLEncode(jsonObject);
    rest.makePostRequest(path,body, callback);
};

/**
 * Prototype of updating an unit.
 * @param job_id {String} - The ID of a existed job.
 * @param jsonObject {object} - The attributes of an unit.
 * @param unit_id {String} - The ID of an unit.
 * @param callback {function} - A callback function.
 */
Unit.prototype.updateUnit = function(job_id, jsonObject, unit_id, callback){
    job_id = encodeURI(job_id);
    unit_id = encodeURI(unit_id);
    var keys = Object.keys(jsonObject);
    var path = '/v1/jobs/' + job_id + '/units/' + unit_id + '?';
    var body = '?key=' + this.apiKey + '&' + crowdflowerURLEncode(jsonObject);
    rest.makePutRequest(path,body, callback);
};

/**
 * Prototype of reading an unit information.
 * @param job_id {String} - The ID of a existed job.
 * @param unit_id {String} - The ID of an unit.
 * @param callback {function} - A callback function.
 */
Unit.prototype.readUnit = function(job_id, unit_id, callback){
    job_id = encodeURI(job_id);
    unit_id = encodeURI(unit_id);
    var path = '/v1/jobs/' + job_id + '/units/(' + unit_id +')?';
    path += 'key=' + this.apiKey;
    rest.makeGetRequest(path, callback);
};

/**
 * Prototype of deleting an unit.
 * @param job_id {String} - The ID of a existed job.
 * @param unit_id {String} - The ID of an unit.
 * @param callback {function} - A callback function.
 */
Unit.prototype.deleteUnit = function(job_id, unit_id, callback){
    job_id = encodeURI(job_id);
    unit_id = encodeURI(unit_id);
    var path = '/v1/jobs/' + job_id + '/units/' + unit_id +'?';
    path += 'key=' + this.apiKey;
    //console.log(path);
    rest.makeDeleteRequest(path, callback);
};

/**
 * Prototype of splitting fields.
 * @param job_id {String} - The ID of a existed job.
 * @param columnField {array} - An array of column field
 * @param delimiter {String} - Delimiter for split fields.
 * @param callback {function} - A callback function.
 */
Unit.prototype.splitField = function(job_id, columnField, delimiter, callback){ //columeField is a array of columeField
    job_id = encodeURI(job_id);
    delimiter = encodeURI(delimiter);
    var path = '/v1/jobs/' + job_id + '/units/split?';
    var fieldValue = [];
    for(var i in columnField){
        if (columnField.hasOwnProperty(i)) {
            fieldValue[i] = encodeURI(columnField[i]);
            path += 'on=' + fieldValue[i] + ',';
        }
    }
    path += '&with=' + delimiter + '&key=' + this.apiKey;
    rest.makePutRequest(path,callback);
};

module.exports = Unit;
