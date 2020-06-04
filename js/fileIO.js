var fs = require("fs");

////////////////////////////////
////// Writing JSON File ///////
////////////////////////////////
async function writeAsJson(filename, data){
    var fileData = await readJson(filename);
    console.log(fileData);
    data = JSON.stringify(data);
    fs.writeFile(filename, data, (err)=>{
        if (err) throw err;
    });
}

async function readJson(filename){
        fs.readFile(filename, (err, data)=>{
        if (err) throw err;
        data = JSON.parse(data);
        return data;
    })}

module.exports.writeAsJson = writeAsJson;
module.exports.readJson = readJson;

//writeAsJson("Testing",[1,2,3,4]);
//readJson("Testing");

//readJson doesn't return promises properly, check following example:

async function firstAsync() {
    let promise = new Promise((res, rej) => {
        setTimeout(() => res("Now it's done!"), 1000)
    });

    // wait until the promise returns us a value
    let result = await promise; 
  
    // "Now it's done!"
    console.log(result); 
    }

firstAsync();