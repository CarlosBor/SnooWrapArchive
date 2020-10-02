var snoowrap = require('snoowrap');
var request = require('request');
var fs = require('fs');
var config = require('../config/config.js');
var fileIO = require('../js/fileIO.js');
const Mongo = require('mongodb');
const DBfunctions = require('../js/DBfunctions.js');

const monthNames = ["January", "February", "March", "April", "May","June","July", "August", "September", "October", "November", "December"];
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

//downloadTop("dankmemes", "month");
//Postname, Subreddit, Number.

//snoo.getSubreddit('anime_irl').getTop('month').then(console.log);
//post.title
//array order is same as ranking order in top.


////////////////
//Server Logic//
////////////////

const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({ port: 8081 });

//Database
MongoClient = Mongo.MongoClient;
const uri = config.dburi;
const client = new MongoClient(uri, { useNewUrlParser: true });
//MongoDB connection.
//client.connect();

wss.on('connection', ((ws) => {
    client.connect();
    ws.on('message', (message) => {
        //Debugging
        console.log("Raw input", message);
        //Si es texto puro sale por consola, si es un objeto se procede a parsear.
        try{
            message = JSON.parse(message)
        }catch{
            console.log(message);
            return;
        };
        //Caja de texto
        if (message["type"] == "inputBox"){
            DBfunctions.addToWatch(client, message["subReddit"], message["timeframe"]);
            fileIO.writeAsJson("ArchiveData",[message["subReddit"], message["timeframe"]])
            .then(function(){
                fileIO.readJsonCallback("archiveData", function(err, data){
                    dataObject = new fileIO.JSONableMessage("updateSubs", data);
                    dataObject = dataObject.toJSON();
                    ws.send(dataObject);
                })
            })
        }
        //Boton de quitar subreddit
        if(message["type"] == "removeSub"){
            subAndTime = JSON.parse(message["content"]);
            console.log(subAndTime);
            DBfunctions.removeFromWatch(client, subAndTime[0], subAndTime[1]);
            //I have to redo how the UI works in sending info to remove the sub
            data = fileIO.readJson("ArchiveData")
            .then(data => {
                for (i=0;i<data.length;i++){
                    if (data[i][0]==message["content"]){
                        data.splice(i,1);
                    }
            }
            //Envia el paquete nuevo para refrescar
            dataObject = new fileIO.JSONableMessage("updateSubs", data);
            dataObject = dataObject.toJSON();
            ws.send(dataObject);
            data = JSON.stringify(data);
            //Escribe directamente en el archivo el resultado
            fs.writeFile("ArchiveData", data, (err)=>{
                if (err) throw err;
                console.log("Complete rewrite Succesful");
            });
            });
        }
    });
    ws.on('end', () => {
        console.log('Connection ended...');
    });
    ws.send('Hello Client');
    //Refresca la pagina con los subreddits añadidos al abrir
    fileIO.readJsonCallback("archiveData", function(err, data){
        dataObject = new fileIO.JSONableMessage("updateSubs", data);
        dataObject = dataObject.toJSON();
        ws.send(dataObject);
    })
}));
