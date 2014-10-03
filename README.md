Nodejs-Crowdflower
=========
A toolkit for interacting with CrowdFlower via the REST API. Uses Q promises to
fetch and work with objects.

Example Usage
-------------

### Connect to Crowdflower
Create a connection to Crowdflower

	var cf = new Crowdflower(myApiKey);

Retrieve your account information.

  cf.accountInfo();

### Jobs
Get an array of all your jobs from Crowdflower:

  cf.fetchAllJobs();

Get a specific job from Crowdflower:

  cf.fetchJob(000001);

Create a new job:

  var jobTemplate = {
    "title": "My Big Job"
  };
  cf.createJob(jobTemplate);

Updating a job:

  cf.fetchJob(000001).then(
    function(job){
      job.title = "My first job's new title."
      job.update();
    },
  );

Deleting a job:

  cf.fetchJob(000001).then(
    function(job){
      job.delete();
    }
  );



Contributing
------------

1. Fork nodejs-crowdflower
2. Create a topic branch - `git checkout -b my_branch`
3. Make your feature addition or bug fix and add tests for it.
4. Commit, but do not mess with the rakefile, version, or history.
5. Push to your branch - `git push origin my_branch`
6. Create an Issue with a link to your branch

Copyright
---------

Copyright &copy; 2014 [Scott Bateman](https://github.com/scottbateman),[Eason Wang](http://github.com/EasonWang90). See LICENSE for details.
