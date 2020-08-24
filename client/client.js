var ws = new WebSocket("ws://127.9.9.1:8081");
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
    }catch{
        console.log(message);
        return;
    };
    if (message=="updateSubs"){
        refreshSubs(message["subInfo"]);
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
        //ws.send("inputBox" + " " + document.getElementById('commandInput').value +" " + document.getElementById('subTime').value);
    }  
  }

function refreshSubs(subInfo){
    /* [
        [Subname, timespan]
        [Subname, timespan]
    ]
    */
   subListing = document.createElement("div");
   for(i=0; i++; i<subInfo.length){
        rowDiv = document.createElement("div");
        rowDiv.classList.add("subListing");
        subNameDiv = document.createElement("div");
        subNameDiv.classList.add("subNameDiv");
        subNameDiv.innerHTML = subInfo[i][0];
        timeFrameDiv = document.createElement("div");
        timeFrameDiv.classList.add("timeFrameDiv");
        timeFrameDiv.innerHTML = subInfo[i][0];
        removeDiv = document.createElement("div");
        removeDiv.classList.add("removeDiv");
        rowDiv.appendChild(subNameDiv);
        rowDiv.appendChild(timeFrameDiv);
        rowDiv.appendChild(removeDiv);
        subListing.appendChild(rowDiv);
   }
   document.querySelector("#archivedSubsList").appendChild(subListing);
}

window.onload = function () {
    document.getElementById('commandInput').addEventListener("keydown",logger);
};