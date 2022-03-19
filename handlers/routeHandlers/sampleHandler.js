// dependencies


// mdoule scafollding
// const handler ={}


// handler.sampleHandler =(requireProperties, callBack)=>{
//     console.log(requireProperties);

//     callBack(200, {
//         message: "This is a sample url"
//     })
// }


// module.exports = handler


const handler = {};

handler.sampleHandler=(requireProperties, callBack)=>{
    console.log(requireProperties);
        callBack(200, {
        message: "This is sample world"
    })
}


module.exports = handler;
