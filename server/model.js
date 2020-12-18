var snoowrap = require('snoowrap');
var request = require('request');
var fs = require('fs');
var config = require('../config/config.js');
const Mongo = require('mongodb');
var md5 = require('md5');

Date.prototype.getISOWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

//load username and password via config file.
const snoo = new snoowrap({
    userAgent: 'Nodejs archiver (by /u/Levitz)',
    clientId: 'Nfmnw-GhnA3WGA',
    clientSecret: 'tSF60EQuYHekG8n5KQgmWXsm8UE',
    username: config.username,
    password: config.password,
  });

  //Downloads a single piece of media to the path from the url.
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

//Simply makes a folder, proper way is to try it and skip if error happens, apparently.
function createfolder(path, callback){
    fs.mkdir(path,(err)=>{
        if(err){
            if (err.code== 'EEXIST') callback(null);
            else callback(err);
        } else callback(null);
    })
}

function getRelevantInfo(post, timeframe){
    //The API returns seconds since epoch, JS uses milliseconds.
    creationDate = post.created*1000;
    //MD5 from URL, just to get an unique identifier, will be used for sorting.
    urlMD5 = md5(post.url);
    
    if (timeframe=="week"){
        isoWeek = new Date(creationDate).getISOWeek();
        return [post.subreddit.display_name, post.url, post.score, timeframe, isoWeek, urlMD5];
    }
    if (timeframe=="month"){
        month = new Date(creationDate).getMonth();
        return [post.subreddit.display_name, post.url, post.score, timeframe, month, urlMD5];
    }
    if (timeframe=="year"){
        year = new Date(creationDate).getFullYear();
        return [post.subreddit.display_name, post.url, post.score, timeframe, year, urlMD5];
    }
}

//TRIES to download the top 25 media from that timeframe.
async function downloadTop(subName, timeframe){
    var posts = await snoo.getSubreddit(subName).getTop(timeframe);
    urlTitle = posts.map(post => [post.url, post.title]);
    console.log(urlTitle);
    var date = new Date();
    createfolder(subName, console.log);
    for (let i=0;i<urlTitle.length;i++){
        let title = subName + monthNames[date.getMonth()];
        download(urlTitle[i][0],"../downloads/"+subName+"/" + title +" "+ (i+1), ()=>{
            console.log("Downloaded file " + i + " from "+ urlTitle[i][0]);
        })
    }
}

//Gets the 25 top submissions from subName in the timeframe
async function retrieveInfoTop(subName, timeframe){
    var posts = await snoo.getSubreddit(subName).getTop(timeframe);
    return [posts, timeframe];
}

module.exports.retrieveInfoTop = retrieveInfoTop;
module.exports.getRelevantInfo = getRelevantInfo;
module.exports.download = download;
module.exports.createfolder = createfolder;