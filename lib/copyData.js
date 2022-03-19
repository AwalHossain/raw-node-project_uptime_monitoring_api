    const fs = require('fs');
    const path = requir("path")

// module scaffolding
        const lib ={

        }


    lib.basedir= path.join(__dirname, "../.data/");


    lib.create =(dir, file, data, callback)=>{
        
        //Open file for writing 
        fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor)=>{
            if(!err && fileDescriptor){
                const stringData = JSON.stringify(data);

                fs.writeFile(fileDescriptor, stringData, (err2)=>{
                    if(!err2){
                        fs.close(fileDescriptor, (err3)=>{
                            if(!err3){
                                callback(false)
                            }else{
                                callback("Error writing new file")
                            }
                        })
                    }
                })
            } else{
                callback("There wan an error and file may be already exists!")
            }
        })
    }

    lib.read=(dir, file, callback)=>{
        fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf-8", (err, data)=>{
            callback(err, data)
        })
    }


    lib.update=(dir, file, data, callback)=>{
        fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor)=>{
            if(!err && fileDescriptor){
    
                const stringData = JSON.stringify(data);
    
                fs.ftruncate(fileDescriptor, (err2)=>{
                    if(!err2){
                        fs.writeFile(fileDescriptor, stringData, (err3)=>{
                                if(!err){
                                    fs.close(fileDescriptor, (err4)=>{
                                        if(!err4){
                                            callback(false)
                                        }else{
                                            callback("Error closing file")
                                        }
                                    })
                                }
                        })
                    }else{
                        console.log("Error truncating file!");
                    }
                })
    
            }else{
                console.log("Error updating file, it might not exist");
            }
        })
    }
    

    module.exports = lib;