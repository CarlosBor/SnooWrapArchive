var snoowrap = require('snoowrap');
var request = require('request');
var fs = require('fs');
var config = require('./config.js');

const monthNames = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
//load username and password via config file.
const snoo = new snoowrap({
    userAgent: 'Nodejs archiver (by /u/Levitz)',
    clientId: 'Nfmnw-GhnA3WGA',
    clientSecret: 'tSF60EQuYHekG8n5KQgmWXsm8UE',
    username: config.username,
    password: config.password,
  });

const download = (url, path, callback) =>{
    request.head(url, (err, res, body)=>{
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

function createfolder(path, callback){
    fs.mkdir(path,(err)=>{
        if(err){
            if (err.code== 'EEXIST') callback(null);
            else callback(err);
        } else callback(null);
    })
}


//Request example:
//request.getHot().map(post => post.title).then(console.log);

//Getting the ID of the top submissions of the month to anime_irl:
//snoo.getSubreddit('anime_irl').getTop('month').map(post => post.url + " " + post.id).then(console.log);

//Returns the url of the submission with that ID
//request.getSubmission('g6901a').url.then(console.log);

//Returns a list of the urls of the top25 posts by month.
//v.redd.it for videos
//i.redd.it for images
//www.reddit for posts

//'https://v.redd.it/unfglph3u0l41 feb3pn',

function downloadTop(subName, timeframe){
    snoo.getSubreddit(subName).getTop(timeframe)
    .map(post => [post.url, post.title])
    .then((urlArray)=>{
        var date = new Date();
        createfolder(subName, console.log);
        for (let i=0;i<urlArray.length;i++){
            let title = subName + monthNames[date.getMonth()];
            download(urlArray[i][0],subName+"/" + title + i, ()=>{
                console.log("Downloaded file " + i + " from "+ urlArray[i][0]);
            })
        }
    });  
}
downloadTop("Anime_IRL", "month");
//Postname, Subreddit, Number.

//snoo.getSubreddit('anime_irl').getTop('month').then(console.log);
//post.title
//array order is same as ranking order in top.

/* download('https://i.redd.it/ao5lum6hqae31.jpg', 'test.jpg', ()=>{
    console.log("Worked");
})  */

// \/:"?<>*|