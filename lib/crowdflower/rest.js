var https = require('https');
var Q = require('q');

/**
 * makeRequest
 * @param method
 * @param path
 * @param body
 * @param contentType
 * @returns {promise|*|Q.promise}
 */
function makeRequest(method, path, body, contentType){

    method = method.toUpperCase();

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
        'content-length' : Buffer.byteLength(body, 'utf8')
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

    var deffered = Q.defer();

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
            if (err){
                deffered.reject(err);
            }
            else{
                deffered.resolve(data);
            }
        });

    };

    /**
     *
     * @type http.ClientRequest
     */
    var req = https.request(options, requestCallback);

    // Write to HTTPS
    if(body){
        req.write(body);
    }
    req.end();
    req.on('error', function(e){
        console.log(e);
    });

    return deffered.promise;
}

/**
 * GET
 * @param path
 * @returns {*}
 */
function makeGetRequest(path){
    return makeRequest('GET', path, "", null);
}

/**
 * POST
 * @param path
 * @param body
 * @param contentType
 * @returns {*}
 */
function makePostRequest(path, body, contentType){
    return makeRequest('POST', path, body, contentType);
}

/**
 * PUT
 * @param path
 * @param body
 * @returns {*}
 */
function makePutRequest(path, body) {
    return makeRequest('PUT', path, body, null);
}

/**
 * DELETE
 * @param path
 * @param body
 * @returns {*}
 */
function makeDeleteRequest(path, body){
    return makeRequest('DELETE', path, body, null);
}

/**
 * Handles application responses received from Crowdflower.
 * @param response
 * @returns {message|*|string|Error.message|assert.AssertionError.message|e.message}
 */
function handleApplicationResponse (response){
    /** @todo Could be a cleaner way to do this. */
    if (response.success){
        return response.success.message;
    }
    else if (response.error){
        throw new Error(response.error.message);
    }
}

/**
 * Handles JSON strings received by Crowdflower.
 * @param jsonString
 * @returns {*}
 */
function handleJsonResponse (jsonString){
    var object = JSON.parse(jsonString);

    if(object.error){
        throw new Error(object.error.message);
    }

    return object;
}


exports.makePutRequest = makePutRequest;
exports.makeGetRequest = makeGetRequest;
exports.makePostRequest = makePostRequest;
exports.makeDeleteRequest = makeDeleteRequest;
exports.handleApplicationResponse = handleApplicationResponse;
exports.handleJsonResponse = handleJsonResponse;
