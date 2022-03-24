/*
 * Title: User Handler
 * Description: Handler to handle user related routes
 * Author: Awal 
 * Date: 15/03/22
 *
 */
// dependencies
const { parseJSON, createRandomStr } = require('../../helpers/utilities');
const data = require('../../lib/data')
const tokenHandler = require('../../handlers/routeHandlers/tokenHandler')
const { maxChecks } = require("../../helpers/environments")

// module scaffold
const handler = {};

console.log(maxChecks);
handler.checkHanldler = (requestProperties, callback) => {
    const acceptMethods = ['get', 'post', 'put', 'delete'];
    if (acceptMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback)
    } else {
        callback(405)
    }
}

handler._check = {};

handler._check.post = (requestProperties, callback) => {

    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false

    let url = typeof requestProperties.body.url === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof requestProperties.body.method === 'string' && ['get', 'post', 'put', 'delete'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false

    let successCodes = typeof requestProperties.body.successCodes === 'object' && requestProperties.body.successCodes instanceof Array ? requestProperties.body.successCodes : false;

    let timeoutSeconds = typeof requestProperties.body.timeoutSeconds === 'number' &&
        requestProperties.body.timeoutSeconds % 1 === 0 &&
        requestProperties.body.timeoutSeconds >= 1 &&
        requestProperties.body.timeoutSeconds <= 5
        ? requestProperties.body.timeoutSeconds
        : false;


    console.log(protocol, url, successCodes, timeoutSeconds);

    if (protocol && url && method && successCodes && timeoutSeconds) {

        const token =
            typeof requestProperties.headersObject.token === 'string'
                ? requestProperties.headersObject.token
                : false

        data.read('token', token, (err1, tokenData) => {
            if (!err1 && tokenData) {

                let userPhone = parseJSON(tokenData).phone;

                data.read('users', userPhone, (err2, userData) => {
                    tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {

                        if (tokenIsValid) {
                            let userObject = parseJSON(userData);
                            console.log(userObject);
                                 const userChecks =
                                    typeof userObject.checks === 'object' &&
                                    userObject.checks instanceof Array
                                        ? userObject.checks
                                        : [];

                            if (userChecks.length < maxChecks) {
                                let checkId = createRandomStr(20);

                                let checkObject = {
                                    id: checkId,
                                    userPhone,
                                    protocol,
                                    url,
                                    method,
                                    successCodes,
                                    timeoutSeconds
                                }
                                data.create('checks', checkId, checkObject, (err3) => {
                                    if (!err3) {
                                        // add checkid to the users
                                        console.log(userChecks);
                                        userObject.checks = userChecks;
                                        userObject.checks.push(checkId)

                                        // save the new user data

                                        data.update('users', userPhone, userObject, (err4) => {
                                            if (!err4) {
                                                callback(200, checkObject)
                                            }
                                        })

                                    } else {
                                        callback(500, {
                                            error: 'There was a problem in your server',
                                        });
                                    }
                                })
                            } else {
                                callback(500, {
                                    error: `User already reached max check limit`
                                })
                            }



                        } else {
                            callback(403, {
                                error: 'Authentication problem!',
                            })
                        }
                    })
                })

            } else {
                callback(400, {
                    error: 'Authentication failed',
                });
            }
        })

    } else {
        callback(400, {
            error: 'There was a problem in your request!',
        });
    }
}
handler._check.put = (requestProperties, callback) => {

}

handler._check.get = (requestProperties, callback) => {

}




handler._check.delete = (requestProperties, callback) => {

};

module.exports = handler;
