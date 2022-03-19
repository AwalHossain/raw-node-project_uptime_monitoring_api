// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/hanldeReqRes');
const environment = require('./helpers/environments')
const data = require("./lib/data")


// app object - module scaffolding
const app = {};

// configuration

// data create in file 

// data.create('test', 'newFile', {"name": "Shishir", "Language": "Bengali", "hometown":"Sylhet"}, (err)=>{
//     console.log(`error was`, err);
// })

// read file 

// data.read('test', 'newFile', (err, data)=>{
//     console.log(err, data)
// } )


// update file
// data.update('test', 'newFile',{"name": "India", "lang":"Hindi"}, (err, data)=>{
//     console.log(err, data);
// })

// data.update('test', )

// data.delete('test', 'newFile', (err)=>{
//     console.log(err);
// })

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    console.log(environment);
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle Request Response
app.handleReqRes = handleReqRes;

// start the server
app.createServer();