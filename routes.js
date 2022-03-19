

//dependencies
// const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler")

// const routes = {
//     about: sampleHandler,
// }


// module.exports = routes

   

const {sampleHandler} = require("./handlers/routeHandlers/sampleHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler
}


module.exports = routes;