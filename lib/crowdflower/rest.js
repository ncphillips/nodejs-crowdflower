var https = require('https');


function makeRequest(method, path, jsonObject, contentType, callback){
    if (contentType === null){
        contentType = 'application/x-www-form-urlencoded';
    }

    var header = {
        'accept' : 'application/json',
        'content-type': contentType,
        'connection': 'keep-alive',
        'content-length' : Buffer.byteLength(jsonObject, 'utf8')
    };

    var options = {
        host: 'api.crowdflower.com',
        port: 443,
        path: path,
        method: method,
        headers: header
    };

    var data = '';

    var requestResponse = function(res){
        var err = null;
        res.on('data', function(chunk){
            data += chunk;
        });
        res.on('end', function(){
            callback(err, data)
        });

    };

    var req = https.request(options, requestResponse);
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
    // Optional contentType
    if(typeof callback === undefined){
        contentType = null;
        callback = contentType;
    }
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