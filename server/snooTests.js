var snoowrap = require('snoowrap');
var config = require('../config/config.js');
var md5 = require('md5');
const snoo = new snoowrap({
    userAgent: 'Nodejs archiver (by /u/Levitz)',
    clientId: 'Nfmnw-GhnA3WGA',
    clientSecret: 'tSF60EQuYHekG8n5KQgmWXsm8UE',
    username: config.username,
    password: config.password,
  });

  /**
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
 */

async function downloadTop(subName, timeframe){
    var posts = await snoo.getSubreddit(subName).getTop(timeframe);
    urlTitle = posts.map(post => [post.url, post.title]);
    console.log(getRelevantInfo(posts[0],timeframe));
}

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

  //Gotta adapt it for different timeframes.
function getRelevantInfo(post, timeframe){
    //The API returns seconds since epoch, JS uses milliseconds.
    creationDate = post.created*1000;
    //MD5 from URL, just to get an unique identifier, will be used for sorting.
    urlMD5 = md5(post.url);
    
    if (timeframe=="week"){
        isoWeek = new Date(creationDate).getISOWeek();
        return [post.subreddit.display_name, post.url, post.score, isoWeek, urlMD5];
    }
    if (timeframe=="month"){
        month = new Date(creationDate).getMonth();
        return [post.subreddit.display_name, post.url, post.score, month, urlMD5];
    }
    if (timeframe=="year"){
        year = new Date(creationDate).getFullYear();
        return [post.subreddit.display_name, post.url, post.score, year, urlMD5];
    }
}

async function retrieveInfoTop(subName, timeframe){
    var posts = await snoo.getSubreddit(subName).getTop(timeframe);
    return [posts, timeframe];
}

retrieveInfoTop("anime_IRL",{time:"week"}).then(function(info){
    console.log(info[0][0].url);
});

retrieveInfoTop("pics", {time:"week"}).then(function(result){
    console.log(result[0][0].title);
})