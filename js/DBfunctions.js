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


async function addToWatch(subredditName, subredditTime){
    await client.connect();
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
    database = client.db("RedditArchive");
    collection = database.collection("watched_subs");
    //Do this, turn them into an array
    cursor = collection.find( {},{projection: { subredditName: 1, subredditTime: 1, _id: 0 }})
    array = await cursor.toArray();
    return(array);
    //Has to send the info to the UI and refresh
}

module.exports.addToWatch = addToWatch;
module.exports.removeFromWatch = removeFromWatch;
module.exports.retrieveWatchedSubs = retrieveWatchedSubs;
//retrieveWatchedSubs();
//addToWatch("Anime_IRL", "week");
//removeFromWatch("Anime_IRL", "week");