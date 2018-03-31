
function requestUserId() {
    return fetchJsonFrom('/users','post', null).then(json => {
        return json.currentId;
    }).catch((error) => {
        if (error.toString().startsWith('error-')) {
            return Promise.reject(error);
        }
        return Promise.reject('error-response-json-bad');
    });
}

function getUserList() {
    return fetchJsonFrom('/users','get', null).then(json => {
        return json;
    }).catch((error) => {
        if (error.toString().startsWith('error-')) {
            return Promise.reject(error);
        }
        return Promise.reject('error-response-json-bad');
    });
}

function fetchJsonFrom(url, method, currentId) {
    return fetch(url, {
        method: method,
        headers: {currentId : currentId}
    }).then(response => {
        if (response.ok) return response.json();
        return Promise.reject('error-response-not-okay');
    });
}

module.exports = {
    requestUserId : requestUserId,
    getUserList : getUserList,
    fetchJsonFrom : fetchJsonFrom
}