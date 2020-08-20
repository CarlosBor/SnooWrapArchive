var ws = new WebSocket("ws://127.9.9.1:8081");
ws.onopen = function(event){
    console.log("Connection open ");
    ws.send("Hello server");
}

ws.onerror = function (err){
    console.log('err: ', err);
}

ws.onmessage = function (event){
    console.log(event.data);
};

ws.onclose = function() {
    console.log("Connection is closed...");
}

function logger(e){
     if(e.keyCode == 13){
         console.log("Hm");
         dataObject = new Object();
         dataObject.type = "inputBox",
         dataObject.subReddit = document.getElementById('commandInput').value,
         dataObject.timeframe = document.getElementById('subTime').value;
         dataObject = JSON.stringify(dataObject);
         ws.send(dataObject);
        //ws.send("inputBox" + " " + document.getElementById('commandInput').value +" " + document.getElementById('subTime').value);
    }  
  }

window.onload = function () {
    document.getElementById('commandInput').addEventListener("keydown",logger);
};