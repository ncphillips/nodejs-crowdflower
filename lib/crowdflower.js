/* jslint node:true */
"use strict";

/**
 * Decide what is the next to-do thing.
 *
 * @module factory
 * @type {job|exports}
 * @requires ./crowdflower/job
 * @requires ./crowdflower/unit
 * @requires ./crowdflower/judgment
 * @requires ./crowdflower/worker
 */
var Job = require("./crowdflower/job");
var Unit = require("./crowdflower/unit");
var Judgment = require("./crowdflower/judgment");
var CrowdWorker = require("./crowdflower/crowdworker");

exports.factory = function(fileName, apiKey){
    var object = null;
    switch (fileName){
        case "job":
            object = new Job(apiKey);
            break;
        case "unit":
            object = new Unit(apiKey);
            break;
        case "judgment":
            object = new Judgment(apiKey);
            break;
        case "worker":
            object = new Worker(apiKey);
            break;
    }
    return object;
};

module.exports.Job = Job;
module.exports.Unit = Unit;
module.exports.Judgment = Judgment;
module.exports.CrowdWorker = CrowdWorker;
