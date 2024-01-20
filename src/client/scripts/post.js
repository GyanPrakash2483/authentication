export function post(url, data, response) {
    fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(res => {
        response(res);
    })
}