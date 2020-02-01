const rootUrl = 'https://api.imgur.com/3/gallery/t/'
const apiKey = '546c25a59c58ad7'
module.exports = {
  get (url) {
    return fetch(rootUrl + url, {
      headers: {
        'Authorization': 'Client-ID ' + apiKey
      }
    })
    .then((response) => {
      return response.json()
    })
  }
}