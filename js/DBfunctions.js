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
    database = client.db("RedditArchive");
    collection = database.collection("watched_subs");
    //Do this, turn them into an array
    cursor = collection.find( {},{projection: { subredditName: 1, subredditTime: 1, _id: 0 }})
    array = await cursor.toArray();
    return(array);
    //Has to send the info to the UI and refresh
}

//El mismo envio puede ser procesado varias veces, si es el 2º con mas puntuacion nunca tendra 25 por delante, con lo que entrara constantemente.
//Si el envio ya existe, en lugar de ser introducido, deberia actualizar la entrada ya existente.


async function rankSubmission(client, infoArray){
    database = client.db("RedditArchive");
    collection = database.collection("saved_submissions");
    //This checks if the submission is already in the database. just update the score if it's already there
    cursor = await collection.findOne({"post_url": infoArray[1]}).then(async function(result){
        if(result!=null){
            collection.updateOne({"post_url": infoArray[1]}, {$set: {score: infoArray[2]}})
        }else{//Otherwise, add it to the list and remove the 26th result.
            //Do this, turn them into an array
            cursor = collection.find( {"display_name": infoArray[0], "timeframe": infoArray[3], "score": {$gte:infoArray[2]}});
            array = await cursor.toArray();
            if(array.length<25){
                //insert the post, if there are more than 25 posts for that sub and timeframe remove the last.
                collection.insertOne({"display_name":infoArray[0], "post_url": infoArray[1], "score": infoArray[2], "timeframe": infoArray[3], "timeReference": infoArray[4], "mod5":infoArray[5]})
                .then(async function(){
                    topsubm = collection.find({"display_name": infoArray[0], "timeframe": infoArray[3]}).sort({"score":1});
                    result = await topsubm.toArray();
                })
            }
        }
    })
}

async function getAllSubmissions(client){
    database = client.db("RedditArchive");
    collection = database.collection("saved_submissions");
    cursor = collection.find({"saved":null});
    array = await cursor.toArray();
    return array;
}

module.exports.addToWatch = addToWatch;
module.exports.removeFromWatch = removeFromWatch;
module.exports.retrieveWatchedSubs = retrieveWatchedSubs;
module.exports.rankSubmission = rankSubmission;
module.exports.getAllSubmissions = getAllSubmissions;

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
