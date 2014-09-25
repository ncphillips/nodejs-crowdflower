var https = require('https');


/**
 * makeRequest
 *
 * @param {string} method
 * Four options:
 *  1. "GET"
 *  2. "POST"
 *  3. "PUT"
 *  4. "DELETE"
 * @param path
 * @param jsonObject
 * @param contentType
 * @param callback
 */
function makeRequest(method, path, jsonObject, contentType, callback){
    var methodOptions = ['GET', 'POST', 'PUT', 'DELETE'];
    methodOptions.

    method = method.toUpperCase();

    if (methodOptions.indexOf(method) < 0){
        var err = new Error(method + ' is not a valid HTTPS method.');
        callback(err);
    }

    if (contentType === null){
        contentType = 'application/x-www-form-urlencoded';
    }

    /**
     * HTTPS Request Header
     * @type {{accept: string, content-type: *, connection: string, content-length: Number}}
     * @todo Documentation explaing which parts of the header the user can set, and what the others are set to.
     */
    var header = {
        'accept' : 'application/json',
        'content-type': contentType,
        'connection': 'keep-alive',
        'content-length' : Buffer.byteLength(jsonObject, 'utf8')
    };

    /**
     * HTTPS Request Options
     * @type {{host: string, port: number, path: *, method: string, headers: {accept: string, content-type: *, connection: string, content-length: Number}}}
     * @todo Documentation explaing which options the user can set, and what the others are set to.
     */
    var options = {
        host: 'api.crowdflower.com',
        port: 443,
        path: path,
        method: method,
        headers: header
    };

    /**
     * HTTP Response Data
     * @type {string}
     */
    var data = '';

    /**
     * HTTPS Request Callback
     * @param res
     *
     */
    var requestCallback = function(res){
        var err = null;
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function(){
            callback(err, data)
        });

    };

    /**
     *
     * @type http.ClientRequest
     */
    var req = https.request(options, requestCallback);

    // Write to HTTPS
    if(jsonObject){
        req.write(jsonObject);
    }
    req.end();
    req.on('error', function(e){
        console.log(e);
    })
}

function makeGetRequest(path, callback){
    makeRequest('GET', path, "", null, callback);
}

function makePostRequest(path, jsonObject, contentType, callback){
    makeRequest('POST', path, jsonObject, contentType, callback);
}

function makePutRequest(path, jsonObject, callback) {
    makeRequest('PUT', path, jsonObject, null, callback);
}

function makeDeleteRequest(path, jsonObject, callback){
    makeRequest('DELETE', path, jsonObject, null, callback);
}

exports.makePutRequest = makePutRequest;
exports.makeGetRequest = makeGetRequest;
exports.makePostRequest = makePostRequest;
exports.makeDeleteRequest = makeDeleteRequest;