const Mongo = require('mongodb');
var config = require('../config/config.js');
//Collections:
//Watched_Subs
//2 fields, the watched subreddit and whether it's weekly, monthly or such
//2 strings

//Archives themselves
//3 fields, subreddit name, the timing (june, first week of september...), and an array with the top25
//2 strings, one array.

//This would go into the server itself, here only for testing purposes.
MongoClient = Mongo.MongoClient;
const uri = config.dburi;
const client = new MongoClient(uri, { useNewUrlParser: true });


async function addToWatch(client, subredditName, subredditTime){
    database = client.db("RedditArchive");
    collection = database.collection("watched_subs");
    collection.insertOne({subredditName : subredditName, subredditTime : subredditTime})
}

async function removeFromWatch(client, subredditName, subredditTime){
    //await client.connect();
    database = client.db("RedditArchive");
    collection = database.collection("watched_subs");
    collection.deleteOne({subredditName : subredditName, subredditTime : subredditTime})
}

async function retrieveWatchedSubs(client){
    await client.connect();
    database = client.db("RedditArchive");
    collection = database.collection("watched_subs");
    //Do this, turn them into an array
    cursor = collection.find( {},{projection: { subredditName: 1, subredditTime: 1, _id: 0 }})
    array = await cursor.toArray();
    return(array);
    //Has to send the info to the UI and refresh
}

async function addimage(client,result){
    database = client.db("RedditArchive");
    collection = database.collection("images");
    
    //collection.insertOne({})
}

//Limpiar variables por dios.
async function rankSubmission(client, infoArray){
    await client.connect();
    database = client.db("RedditArchive");
    collection = database.collection("saved_submissions");
    //Do this, turn them into an array
    cursor = collection.find( {"display_name": infoArray[0], "timeframe": infoArray[3], "score": {$gte:infoArray[2]}});
    array = await cursor.toArray();
    if(array.length<25){
        //insert the post, if there are more than 25 posts for that sub and timeframe remove the last.
        collection.insertOne({"display_name":infoArray[0], "post_url": infoArray[1], "score": infoArray[2], "timeframe": infoArray[3], "weekNo": infoArray[4], "mod5":infoArray[5]})
        .then(async function(){
            topsubm = collection.find({"display_name": infoArray[0], "timeframe": infoArray[3]}).sort({"score":1});
            result = await topsubm.toArray();
            //console.log(result);
    })
    return 1;
    }
}

module.exports.addToWatch = addToWatch;
module.exports.removeFromWatch = removeFromWatch;
module.exports.retrieveWatchedSubs = retrieveWatchedSubs;
module.exports.rankSubmission = rankSubmission;

//[post.subreddit.display_name, post.url, post.score, timeframe, year, urlMD5];

/*
{
    "display_name": "funny",
    "post_url": "https://i.redd.it/kq0hcb2s23z51.jpg",
    "score": 95828,
    "timeframe": "week",
    "weekNo": 46,
    "MD5": "52bd6e5950704b94cf9cce21d902a96c"
}
*/

//console.log(rankSubmission("whoa", client));
//retrieveWatchedSubs();
//addToWatch("Anime_IRL", "week");
//removeFromWatch("Anime_IRL", "week");

//Given timeframe and subreddit
//get the top 25, then build own top25 with the upvotes
//I could just retrieve the data at specific points in time, but this is more interesting

//[Anime_irl, "week"]