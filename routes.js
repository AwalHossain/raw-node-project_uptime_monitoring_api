

//dependencies
// const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler")

// const routes = {
//     about: sampleHandler,
// }


// module.exports = routes

   

const {sampleHandler} = require("./handlers/routeHandlers/sampleHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { checkHanldler } = require("./handlers/routeHandlers/checkHanldler");

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
    check: checkHanldler
}


module.exports = routes;