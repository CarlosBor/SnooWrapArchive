var fs = require("fs");

////////////////////////////////
////// Writing JSON File ///////
////////////////////////////////
async function writeAsJson(filename, data){
    //Returns error the first time if file doesn't exist, yet creates the file.
    var fileData = await readJson(filename);
    console.log(fileData);
    data = JSON.stringify(data);
    fs.writeFile(filename, data, (err)=>{
        if (err) throw err;
    });
}

async function readJson(filename, callback){
        fs.readFile(filename, (err, data)=>{
        if (err) throw err;
        data = JSON.parse(data);
        callback(null,data);
    })};


module.exports.writeAsJson = writeAsJson;
module.exports.readJson = readJson;

//writeAsJson("Testing",[1,2,3,4]);
//readJson("Testing");

/*
El problema era que estaba intentando usar return.
La mejor opcion es usar mi propio callback para
continuar la ejecucion del proceso */

//https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile