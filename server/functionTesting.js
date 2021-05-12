var config = require('../config/config.js');
const Mongo = require('mongodb');
MongoClient = Mongo.MongoClient;
const uri = config.dburi;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect();
const DBfunctions = require('../js/DBfunctions.js');
const model = require('../server/model.js');


async function cron1() {
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

async function cron2(){
    submissions = await DBfunctions.getAllSubmissions(client).then(function(submissions){
      for(i=0;i<submissions.length;i++){
        console.log(submissions[i]);
        model.createfolder("..\\downloads\\"+submissions[i].display_name+"\\"+submissions[i].timeframe.time+"\\"+submissions[i].timeReference, console.log);
        model.download(submissions[i].post_url,"..\\downloads\\"+submissions[i].display_name+"\\"+submissions[i].timeframe.time+"\\"+submissions[i].timeReference+"\\"+i)
      }
      console.log("Turns out it works");
    })
}

client.connect()
.then(()=>cron2())