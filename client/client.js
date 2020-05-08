var ws = new WebSocket("ws://127.9.9.1:8081");
ws.onopen = function(event){
    console.log("Connection open ");
    ws.send("Hello Server");
}

ws.onerror = function (err){
    console.log('err: ', err);
}

ws.onmessage = function (event){
    console.log(event.data);
    document.body.innerHTML += event.data + '&lt;br&gt;';
};

ws.onclose = function() {
    console.log("Connection is closed...");
}

window.onload = function () {
    console.log("HM");
    document.getElementById('commandInput').addEventListener("click",logger);
    //.addEventListener("keydown",function(e){
    //console.log(e);
/*     if(e.keyCode == 13){
     ws.send(document.getElementById('commandInput').value);
    }  */
};

  function logger(e){
    alert("What");
  }
  