/**
 * The Crowdflower Factories object. It provides a pass through to the three
 * Crowdflower Factories, JobFactory, UnitFactory, and Judgment Factory.
 *
 * @module factory
 * @type {job|exports}
 * @requires ./crowdflower/job.js
 * @requires ./crowdflower/unit.js
 * @requires ./crowdflower/judgment
 */
var Job = require("./crowdflower/job.js"),
    Unit = require("./crowdflower/unit.js"),
    Judgment = require("./crowdflower/judgment.js");

/**
 * @todo Change label of 'filename' variable to something more appropriate.
 *
 * I don't think that variable name really makes sense; although I may be wrong.
 */
exports.factory = function(fileName,apiKey){
    switch (fileName){
        /**
         * @todo Refactor Job, Unit, and Judgment.
         * The name implies these are representations of the types they're named after,
         * but in reality they are Factory Objects for those types. I think it would
         * make sense to rename them "JobFactory", etc.
         */
        case "job":
            obj = new Job(apiKey);
            break;

        case "unit":
            obj = new Unit(apiKey);
            break;

        case "judgment":
            obj = new Judgment(apiKey);
            break;

        /** @todo Implement a GoldFactory for working with Test Questions. */
        //case "gold":
        //    obj = new GoldFactory(apiKey);
        //    break;


        return obj;
    }
}




