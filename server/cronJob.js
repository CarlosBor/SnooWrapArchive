var config = require('../config/config.js');
const Mongo = require('mongodb');
MongoClient = Mongo.MongoClient;
const uri = config.dburi;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect();
const DBfunctions = require('../js/DBfunctions.js');
const model = require('../server/model.js');
//Testing: https://crontab.guru/
//Do notice that this library uses one input more that specifies seconds, the leftmost one.

var CronJob = require('cron').CronJob;
//Each hour, check the monitored subreddits in their respective timeframes and get their submissions, ranking them.
var rankTheSubs = new CronJob('0 */5 */1 * * *', async function() {
  DBfunctions.retrieveWatchedSubs(client).then(function(result){//Fetches the subs watched from the database and their respective timeframes 
    for(i=0;i<result.length;i++){
      model.retrieveInfoTop(result[i].subredditName, {time:result[i].subredditTime}).then(function(infoTop){ //Gets the current top25 submissions from those subs and those timeframes
        for (j=0; j<infoTop[0].length;j++){
          DBfunctions.rankSubmission(client, model.getRelevantInfo(infoTop[0][j], infoTop[1]));
        }
        console.log("Getting top25...");
      })
    }
  })
}
, null, true, 'Europe/Madrid');

//Each day, download and organize the top25
var downloadTheImages = new CronJob('0 */5 */1 * * *', async function(){
    submissions = await DBfunctions.getAllSubmissions(client).then(function(submissions){
      for(i=0;i<submissions.length;i++){
        console.log(submissions[i]);
        model.createfolder("..\\downloads\\"+submissions[i].display_name+"\\"+submissions[i].timeframe.time+"\\"+submissions[i].timeReference, console.log);
        model.download(submissions[i].post_url,"..\\downloads\\"+submissions[i].display_name+"\\"+submissions[i].timeframe.time+"\\"+submissions[i].timeReference+"\\"+i)
      }
      console.log("Turns out it works");
    })
})

downloadTheImages.start();
rankTheSubs.start();