var fs = require("fs");

////////////////////////////////
////// Writing JSON File ///////
////////////////////////////////
async function writeAsJson(filename, data){
    data = JSON.stringify(data);
    fs.writeFile(filename, data, (err)=>{
        if (err) throw err;
        console.log("Works");
    });
}


async function readJson(filename){
        fs.readFile(filename, (err, data)=>{
        if (err) throw err;
        data = JSON.parse(data);
        console.log(data);
        return data;
    })}