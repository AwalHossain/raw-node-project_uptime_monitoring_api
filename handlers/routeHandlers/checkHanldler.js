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
    const id =
    typeof requestProperties.body.id === 'string' &&
      requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;


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
    

        if(id){

            if(protocol || url || method || successCodes || timeoutSeconds){
                console.log(protocol, url);
                console.log("fiji from", "checkData");
                data.read('checks', id, (err, checkData)=>{
                    if(!err && checkData){
                        const checkObject = parseJSON(checkData);

                      

                        const token =
                        typeof requestProperties.headersObject.token === 'string'
                        ? requestProperties.headersObject.token
                        : false
                
                            tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid)=>{
                            if(tokenIsValid){

                                if(protocol){
                            checkObject.protocol = protocol
                                }

                                if(url){
                                    checkObject.url = url
                                }

                                if(method){
                                    checkObject.method = method
                                }

                                if(successCodes){
                                    checkObject.successCodes = successCodes
                                }

                                if(timeoutSeconds){
                                    checkData.timeoutSeconds = timeoutSeconds
                                }

                                // Store the checkObject

                                data.update('checks', id, checkObject, (err2)=>{
                                    if(!err){
                                        callback(200)
                                    }else{
                                        callback(500,{
                                            error: 'There was a server side error'
                                        })
                                    }
                                })

                            }else{
                                callback(400,{
                                    error:'Authentication error'
                                })
                            }
                        } )
                    }else{
                        callback(400,{
                            error:'There was some error in your request'
                        }) 
                    }
                })
            }

      }else{
          callback(500,{
              error:'There was some error in your request'
          })
      }
    

}

handler._check.delete = (requestProperties, callback) => {

    const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
      requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

      if(id){
        data.read('checks', id, (err, checkData)=>{
            console.log(checkData);
            if(!err && checkData){
                const token =
                typeof requestProperties.headersObject.token === 'string'
                    ? requestProperties.headersObject.token
                    : false

                    tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid)=>{
                        console.log(parseJSON(checkData).userPhone);
                        if(tokenIsValid){
                         
                            // data delete 
                            console.log("userObject");
                            data.delete('checks', id, (err1)=>{
                                // const userObject = parseJSON(checkData);
                                if(!err1){
                                    data.read('users',parseJSON(checkData).userPhone, (err2, userData)=>{
                                        const userObject = parseJSON(userData);
                                        if(!err && userData){
                                    const userChecks = typeof userObject.checks === 'object' && userObject.checks instanceof Array ? userObject.checks : []

                                    // remove the deleted check id from user's list of

                                    const checkPosition = userChecks.indexOf(id)
                                    console.log(userObject,"userchecks", id, "id");
                                    if(checkPosition > -1){
                                        userChecks.splice(checkPosition, 1)

                                        userObject.checks = userChecks;
                                        data.update('users', userObject.phone, userObject, (err4)=>{
                                            if(!err4){
                                                callback(200)
                                            }else{
                                                callback(400,{
                                                    error:'there was a server side error'
                                                })  
                                            }
                                        })
                                    }else{
                                        callback(400,{
                                            error:'The id was not founded'
                                        }) 
                                    }

                                        }else{
                                            callback(400,{
                                                error:'There was some error in your request'
                                            })
                                        }
                                    } )
                                }else{
                                    callback(400,{
                                        error:'There was some error in your request'
                                    })  
                                }
                            })


                        }else{
                            callback(500,{
                                error:'Authentication failure'
                            })
                        }
                    } )

            }else{
                callback(400,{
                    error:'There was some error in your request'
                })
            }
        })
      }else{
          callback(500,{
              error:'There was some error in your request'
          })
      }
}





handler._check.get = (requestProperties, callback) => {
    const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
      requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

      if(id){
        data.read('checks', id, (err, checkData)=>{
            console.log(checkData);
            if(!err && checkData){
                const token =
                typeof requestProperties.headersObject.token === 'string'
                    ? requestProperties.headersObject.token
                    : false

                    tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid)=>{
                        console.log(parseJSON(checkData).userPhone);
                        if(tokenIsValid){
                            callback(200, parseJSON(checkData))
                        }else{
                            callback(500,{
                                error:'Authentication failure'
                            })
                        }
                    } )

            }else{
                callback(400,{
                    error:'There was some error in your request'
                })
            }
        })
      }else{
          callback(500,{
              error:'There was some error in your request'
          })
      }

};

module.exports = handler;
