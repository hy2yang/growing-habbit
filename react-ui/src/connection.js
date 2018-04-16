
function requestUserId() {
    return fetchJsonFrom('/users', 'post', null).then(json => {
        return json.currentId;
    }).catch((error) => {
        if (error.toString().startsWith('error-')) {
            return Promise.reject(error);
        }
        return Promise.reject('error-response-json-bad');
    });
}

function getUserList() {
    return fetchJsonFrom('/users', 'get', null).then(json => {
        return json;
    }).catch((error) => {
        if (error.toString().startsWith('error-')) {
            return Promise.reject(error);
        }
        return Promise.reject('error-response-json-bad');
    });
}

function fetchJsonFrom(url, method, jwtToken, body) {
    return fetch(url, {
        method: method,
        headers: {  'content-type': 'application/json', 'Authentication': 'Bearer ' + jwtToken },
        body : JSON.stringify(body)
    }).then(response => response.json()).then(json => Promise.resolve(json))
    .catch((error) => {
        if (error.toString().startsWith('error-')) {
            return Promise.reject(error);
        }
        return Promise.reject('error-response-json-bad');
    });
}

module.exports = {
    fetchJsonFrom: fetchJsonFrom
}