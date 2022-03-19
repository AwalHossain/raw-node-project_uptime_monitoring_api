/*
Not found handler
*/


// mdoule scafollding
// const handler ={}


// handler.notFoundHandler =(requireProperties, callBack)=>{
//     console.log("not found");

//     callBack(404, {
//         message: "Requested url not founded"
//     })
// }


// module.exports = handler

const handler = {};

handler.notFoundHandler =(requireProperties, callBack)=>{
    callBack(404, {
        message: "Not fuck founded"
    })
}


module.exports = handler;