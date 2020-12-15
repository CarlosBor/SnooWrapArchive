//For testing purposes: https://crontab.guru/

var CronJob = require('cron').CronJob;
var job = new CronJob('* * * * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');


var secondJob = new CronJob('*/2 * * * * *', function() {
    console.log('You will see this message every second second');
  }, null, true, 'America/Los_Angeles');
  
  secondJob.start();
  job.start();