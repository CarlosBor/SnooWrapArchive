var fs = require("fs");

////////////////////////////////
////// Writing JSON File ///////
////////////////////////////////

//Streamlines sending messages a bit.
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

async function writeAsJson(filename, dataToWrite){
    return new Promise((resolve, reject) =>{
            readJson(filename)
            .then(function(fileData){
                fileData.push(dataToWrite);
                return fileData
            })
            .catch(function(fileData){
                //Mirar si hay otros errores
                console.log("File doesn't exist, creating...");
                fileData = [dataToWrite];
            })
            .then(function(fileData){
            fileData = JSON.stringify(fileData);
            fs.writeFile(filename, fileData, (err)=>{
                if (err) throw err;
                console.log("Write Succesful");
                resolve();
            });
        });
    })
}

async function readJson(filename){
    return new Promise((resolve, reject) => {
            fs.readFile(filename, (err,data)=>{
                if (err){
                    if (err.code === 'ENOENT'){
                        console.log("File doesn't exist, creating...");
                        data = "[]";
                        fs.writeFile(filename, data,(err)=>{
                            if (err) throw err;
                        })
                    }else{
                        throw err;
                    }
                }
                data = JSON.parse(data);
                resolve(data);
            })
        })
    };
    
    
    async function readJsonCallback(filename, callback){
            fs.readFile(filename, (err, data)=>{
                if (err) throw err;
                data = JSON.parse(data);
                callback(null,data);
            })
        };
    

module.exports.writeAsJson = writeAsJson;
module.exports.readJson = readJson;
module.exports.readJsonCallback = readJsonCallback;
module.exports.JSONableMessage = JSONableMessage;
//writeAsJson("Testing",[1,2,3,4]);
//readJson("Testing");

//https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile