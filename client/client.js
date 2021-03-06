var ws = new WebSocket("ws://127.9.9.1:8081");

//Dirty class import
class JSONableMessage {
    constructor(type, content) {
        if(content===undefined){
            let payload = JSON.parse(type);
            this.type = payload[0];
            this.content = payload[1];
        }else{
            this.type = type;
            this.content = content;
        }
    }
    toJSON(){
        return (JSON.stringify([this.type, this.content]));
    }
    parseJSON(string){
        payload = JSON.parse(string);
        this.type = payload[0];
        this.content = payload[1];
    }
  }

ws.onopen = function(event){
    console.log("Connection open ");
    ws.send("Hello server");
}

ws.onerror = function (err){
    console.log('err: ', err);
}

ws.onmessage = function (message){
    /*Debugging
    console.log("Raw input: ", message);
    console.log("message data: ", message.data);
    */
    //Puedo parsearlo de manera similar a cliente => servidor
    
    try{
        message = JSON.parse(message.data)
        console.log(message, "This is the parsed data");
    }catch{
        console.log(message);
        console.log("A hell of a catch");
        return;
    };
    try{
        dataObject = new JSONableMessage(message[0], message[1]);
        console.log(dataObject);
    }catch{
        console.log("Couldn't turn into JSONableMessage");
    }

    if(dataObject.type == "updateSubs"){
        refreshSubsDB(dataObject.content);
    }
    if(dataObject.type == "errorToClient"){
        console.log(dataObject.content);
    }
};

ws.onclose = function() {
    console.log("Connection is closed...");
}

function logger(e){
     if(e.keyCode == 13){
         dataObject = new Object();
         dataObject.type = "inputBox",
         dataObject.subReddit = document.getElementById('commandInput').value,
         dataObject.timeframe = document.getElementById('subTime').value;
         dataObject = JSON.stringify(dataObject);
         ws.send(dataObject);
    }  
  }

function refreshSubs(subInfo){
    /* [
        [Subname, timespan]
        [Subname, timespan]
    ]
    */
   document.querySelector("#archivedSubsList").innerHTML = "";
   //Parent div
   subListing = document.createElement("div");
   for(i=0; i<subInfo.length; i++){
        rowDiv = document.createElement("div");
        rowDiv.classList.add("subListing");
        //Create div => add class to div => add content to div *3
        subNameDiv = document.createElement("div");
        subNameDiv.classList.add("subNameDiv");
        subNameDiv.innerHTML = subInfo[i][0];
        timeFrameDiv = document.createElement("div");
        timeFrameDiv.classList.add("timeFrameDiv");
        timeFrameDiv.innerHTML = subInfo[i][1];
        removeDiv = document.createElement("div");
        removeDiv.classList.add("removeDiv");
        //removediv doesn't have content but an ID and eventhandler instead
        removeDiv.setAttribute("id", JSON.stringify([subInfo[i][0], subInfo[i][1]]));
        removeDiv.addEventListener("click", function(){removeSub(this.id)});
        rowDiv.appendChild(subNameDiv);
        rowDiv.appendChild(timeFrameDiv);
        rowDiv.appendChild(removeDiv);
        subListing.appendChild(rowDiv);
   }
   document.querySelector("#archivedSubsList").appendChild(subListing);
}


 function refreshSubsDB(subInfoDB){
    /*
    [
    { subredditName: 'Test1', subredditTime: 'week' },
    { subredditName: 'Test2', subredditTime: 'week' },
    { subredditName: 'Test3', subredditTime: 'week' }
    ]
  */
 document.querySelector("#archivedSubsList").innerHTML = "";
   //Parent div
   subListing = document.createElement("div");
   subListing.setAttribute("id", "subListParent");
   for(i=0; i<subInfoDB.length; i++){
        rowDiv = document.createElement("div");
        rowDiv.classList.add("subListing");
        //Create div => add class to div => add content to div *3
        subNameDiv = document.createElement("div");
        subNameDiv.classList.add("subNameDiv");
        subNameDiv.innerHTML = subInfoDB[i].subredditName;
        timeFrameDiv = document.createElement("div");
        timeFrameDiv.classList.add("timeFrameDiv");
        timeFrameDiv.innerHTML = subInfoDB[i].subredditTime;
        removeDiv = document.createElement("div");
        removeDiv.classList.add("removeDiv");
        //removediv doesn't have content but an ID and eventhandler instead
        //Check the result of this, then later add the removal functionality.
        removeDiv.setAttribute("id", subInfoDB[i].subredditName + " " + subInfoDB[i].subredditTime);
        removeDiv.setAttribute("title", "Delete");
        removeDiv.addEventListener("click", function(){removeSubDB(this.id)});
        rowDiv.appendChild(subNameDiv);
        rowDiv.appendChild(timeFrameDiv);
        rowDiv.appendChild(removeDiv);
        subListing.appendChild(rowDiv);
   }
   document.querySelector("#archivedSubsList").appendChild(subListing);
}

function removeSub(subName){
    dataObject = new Object();
    dataObject.type = "removeSub";
    dataObject.content = subName;
    dataObject = JSON.stringify(dataObject);
    ws.send(dataObject);
}

function removeSubDB(subId){
    dataObject = new Object();
    dataObject.type = "removeSub";
    dataObject.content = subId;
    dataObject = JSON.stringify(dataObject);
    ws.send(dataObject);
}

window.onload = function () {
    document.getElementById('commandInput').addEventListener("keydown",logger);
};