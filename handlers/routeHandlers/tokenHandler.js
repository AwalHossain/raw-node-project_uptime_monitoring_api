/*
 * Title: User Handler
 * Description: Handler to handle user related routes
 * Author: Sumit Saha ( Learn with Sumit )
 * Date: 11/21/2020
 *
 */
// dependencies
const { hash, parseJSON, createRandomStr } = require('../../helpers/utilities');
const data = require('../../lib/data')

// module scaffold
const handler = {};


handler.tokenHandler = (requestProperties, callback) => {
    const acceptMethods = ['get', 'post', 'put', 'delete'];
    if (acceptMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback)
    } else {
        callback(405)
    }
}

handler._token = {};

handler._token.post = (requestProperties, callback) => {
    const password =
        typeof requestProperties.body.password === 'string' &&
            requestProperties.body.password.trim().length > 0
            ? requestProperties.body.password
            : false;
    const phone =
        typeof requestProperties.body.phone === 'string' &&
            requestProperties.body.phone.trim().length === 11
            ? requestProperties.body.phone
            : false;
    if (phone && password) {

        // make sure that the user doesn't exist before
        console.log("Hleoa");
        data.read('users', phone, (err1, userData) => {
            const hashedPassword = hash(password);
            console.log(parseJSON(userData).password);
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomStr(20);

                const expired = Date.now() + 60 * 60 * 1000;
                const tokenObj = {
                    phone,
                    id: tokenId,
                    expired
                }

                // stroe the token
                data.create("token", tokenId, tokenObj, (err2) => {
                    if (!err2) {
                        callback(200, tokenObj)
                    } else {
                        callback(500, {
                            error: 'There was a problem in the server'
                        })
                    }
                })
            } else {
                callback(404, {
                    error: 'password is not correct'
                })
            }

        })

    } else {
        callback(404, {
            error: 'You ave a problem in your request'
        })
    }
}


// Get the token and authenticate
handler._token.get = (requestProperties, callback) => {
    const id =
      typeof requestProperties.queryStringObject.id === 'string' &&
        requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false;
        console.log(requestProperties.queryStringObject.id);
    if (id) {
      //lookup the user
      data.read('token', id, (err, u) => {
        if (!err && u) {
          const user = { ...parseJSON(u) }
          
          callback(200, user)
        } else {
          callback(404, {
            error: "Requested token was not founded"
          })
        }
      })
    } else {
      callback(404, {
        error: "Requested token was  founded"
      })
    }
  
  }

// Refresh Token 

 handler._token.put = (requestProperties, callback)=>{

    const id =
        typeof requestProperties.body.id === 'string' &&
        requestProperties.body.id.trim().length === 20
            ? requestProperties.body.id
            : false;
    const extend = !!(
        typeof requestProperties.body.extend === 'boolean' && requestProperties.body.extend === true
    );

            console.log(id, extend);

            if(id && extend){

                data.read('token', id, (err, tokenData)=>{
                    const tokenObject = parseJSON(tokenData);
                    if(tokenObject.expired > Date.now()){
                        tokenObject.expired = Date.now() + 60*60*1000;
                        data.update('token', id, tokenObject, (err2)=>{
                            if(!err2){
                                callback(200)
                            }else{
                                callback(500, {
                                    error:"There was some error"
                                })
                            }
                        })
                    }else{
                        callback("Token is expired")
                    }
                } )
            }else{
                callback(400, {
                    error:"There is smonething wrong in requested section"
                })
            }
 }


// Delete data 

handler._token.delete =(requestProperties, callback)=>{
    console.log("dele");
    const id =
    typeof requestProperties.queryStringObject.id === 'string' &&
    requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id
        : false; 
    console.log(id);
        if(id){
            data.read('token', id, (err, tokenData)=>{
                console.log("inside id", tokenData);
                if(!err && tokenData){
                    console.log("heoadf");
                    data.delete('token', id, (err1)=>{
                        if(!err1){
                            callback(200, {message:'Token successfully deleted'})
                        }else{
                          callback(400, {
                              error:'there is something wrong in req'
                          })  
                        }
                    })
                }
            })
        }else{
            callback(400, {
                error:'there is something wrong in req'
            })  
        }
}


handler._token.verify = (id, phone, callback) => {
    data.read('token', id, (err, tokenData) => {
        console.log(tokenData);
        if (!err && tokenData) {
            if (parseJSON(tokenData).phone === phone && parseJSON(tokenData).expired > Date.now()) {
                console.log("inside");
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    });
};


module.exports = handler