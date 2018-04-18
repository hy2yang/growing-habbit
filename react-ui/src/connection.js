function fetchJsonFrom(url, method, jwtToken, body) {
    return fetch(url, {
        method: method,
        headers: {  'content-type': 'application/json', 'Authentication': 'Bearer ' + jwtToken },
        body : body? JSON.stringify(body):null
    }).then(response => response.json()).then(json => Promise.resolve(json))
    .catch((error) => {
        return Promise.reject(error.toString());   
    });
}

module.exports = {
    fetchJsonFrom: fetchJsonFrom
}