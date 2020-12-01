var snoowrap = require('snoowrap');
var request = require('request');
var fs = require('fs');
var config = require('../config/config.js');
var fileIO = require('../js/fileIO.js');
const util = require('util');

const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November", "December"];
//load username and password via config file.
const snoo = new snoowrap({
    userAgent: 'Nodejs archiver (by /u/Levitz)',
    clientId: 'Nfmnw-GhnA3WGA',
    clientSecret: 'tSF60EQuYHekG8n5KQgmWXsm8UE',
    username: config.username,
    password: config.password,
  });

  async function downloadTop(subName, timeframe){
    var posts = await snoo.getSubreddit(subName).getTop(timeframe);
    //There might be a better way of doing this, but it's a custom object.
    //The idea is that if the subreddit doesn't exist it must return an error.
    if(posts[0]==undefined){
        
    }
    urlTitle = posts.map(post => [post.url, post.title]);
    var date = new Date();
    //The console.log is the callback for the error or not message that the createfolder function returns
    createfolder(subName, console.log);
    for (let i=0;i<urlTitle.length;i++){
        let title = subName + monthNames[date.getMonth()];
        download(urlTitle[i][0],"../downloads/"+subName+"/" + title +" "+ (i+1), ()=>{
            console.log("Downloaded file " + i + " from "+ urlTitle[i][0]);
        })
    }
}

function createfolder(path, callback){
    fs.mkdir(path,(err)=>{
        if(err){
            if (err.code== 'EEXIST') callback(null);
            else callback(err);
        } else callback(null);
    })
}

const download = (url, path, callback) =>{
    request.head(url, (err, res, body)=>{
        //Regex to get the trailing .jpg/.png from the url, returns(stops the function) if format is too long (not an image)
        let regex = /.*\/(.*)/;
        let extension = "."+regex.exec(res.headers['content-type'])[1];
        if(extension.length>5){
            return;
        }
        request(url)
        .pipe(fs.createWriteStream(path+extension))
        .on('close', callback);
    })
}
/*
try{
    snoo.getSubreddit('Anime_ssIRL').fetch().then(function(damn){
        console.log(damn);
    })
}catch(err){
    //Subreddit doesn't exist error
}
//else, do nothing

//Have to modularize the writing of objects?
fileIO.writeAsJson("ArchiveData",[message["subReddit"], message["timeframe"]])
.then(function(){
    fileIO.readJsonCallback("archiveData", function(err, data){
        dataObject = new fileIO.JSONableMessage("updateSubs", data);
        dataObject = dataObject.toJSON();
        ws.send(dataObject);
    })
})*/

snoo.getSubreddit("anime_irl").getTop("week")
.then(function(result){
    //result.ups => amount of upvotes
    //result.created_UTC => UNIX UTC timestamp
    //result.id => ID
    urlTitle = result.map(result => [result.ups, result.created_utc, result.id, result.subreddit]);
    console.log(urlTitle);
})