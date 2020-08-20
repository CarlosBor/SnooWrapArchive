var fs = require("fs");

////////////////////////////////
////// Writing JSON File ///////
////////////////////////////////
async function writeAsJson(filename, data){
    //Returns error the first time if file doesn't exist, yet creates the file.
    try{
        var fileData = await readJson(filename);
        fileData.push(data);
    }
    catch (e){
        //Mirar si hay otros errores
        console.log("File doesn't exist, creating...");
        fileData = [data];
    } 
    fileData = JSON.stringify(fileData);
    console.log("fileData: ",fileData);
    fs.writeFile(filename, fileData, (err)=>{
        if (err) throw err;
    });
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
                console.log("wait what", data);
                data = JSON.parse(data);
                resolve(data);
            })
        })
    };
    
    /*
    async function readJson(filename, callback){
            fs.readFile(filename, (err, data)=>{
                if (err) throw err;
                data = JSON.parse(data);
                console.log("Read data:" , data);
                callback(null,data);
            })
        };
    */

module.exports.writeAsJson = writeAsJson;
module.exports.readJson = readJson;

//writeAsJson("Testing",[1,2,3,4]);
//readJson("Testing");

/*
El problema era que estaba intentando usar return.
La mejor opcion es usar mi propio callback para
continuar la ejecucion del proceso */

//https://stackoverflow.com/questions/10058814/get-data-from-fs-readfile