
// There must be a .env file that holds the URL, but in our case we don't need it as we are just using local host

export function fetchTheQuery(query, variables){
    return fetch('http://localhost:4000/', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            query: query
            ,variables: variables
        })
    }).then(res => {
        return res.json()
    })
}