// dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/hanldeReqRes');
const environment = require('./helpers/environments')
const data = require("./lib/data");
const { sendTwilioSms } = require('./helpers/notification');


// app object - module scaffolding
const app = {};

// todo remove alet

sendTwilioSms('01627656375', 'hellow world', (err)=>{
    console.log(`This is the error`, err);
})

// const accountSid = 'ACf62a4949723e51211a182f2fe3af6561'; 
// const authToken = 'a2f572f9110db42045b745d3d1ae002a'; 
// const client = require('twilio')(accountSid, authToken); 
 
// client.messages 
//       .create({   
//         body: 'my body by sex', 
//          messagingServiceSid: 'MG4adbf718d832096e7b7325c8848ca4b7',      
//          to: '+8801627656375' 
//        }) 
//       .then(message => console.log(message.sid)) 
//       .done();

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