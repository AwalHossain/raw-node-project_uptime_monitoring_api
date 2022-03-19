const fs = require('fs');
const path = require('path');


const lib = {

}

lib.basedir = path.join(__dirname, '../.data/')


lib.create = (dir, file, data, callback)=>{
    //Open file for writin
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor)=>{

        if(!err && fileDescriptor){
            const stringData = JSON.stringify(data);

            fs.writeFile(fileDescriptor, stringData, (err2)=>{
                if(!err2){
                    fs.close(fileDescriptor, (err3)=>{
                        if(!err3){
                            callback(false)
                        }else{
                            callback("Error wrinting new file")
                        }
                    })
                }else{
                    callback("Error writing to new file")
                }
            })

        }else{
            callback('There was an error, file may already exists!')
        }
    })
}


lib.read=(dir, file, callBack)=>{
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data)=>{
        callBack(err, data)
    })
}


// update existing file
lib.update = (dir, file, data, callback) => {
    // file open for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if (!err2) {
                            // close the file
                            fs.close(fileDescriptor, (err3) => {
                                if (!err3) {
                                    callback(false);
                                } else {
                                    callback('Error closing file!');
                                }
                            });
                        } else {
                            callback('Error writing to file!');
                        }
                    });
                } else {
                    callback('Error truncating file!');
                }
            });
        } else {
            console.log(`Error updating. File may not exist`);
        }
    });
};

// Delet existing file

lib.delete =(dir, file, callback)=>{
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err)=>{
        if(!err){
           callback(false);
        } else{
           callback(err);
        }
    })
}


module.exports = lib