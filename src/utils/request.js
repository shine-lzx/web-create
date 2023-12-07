const axios = require('axios')

module.exports = (url, method = 'GET', responseType = 'json') => {
  return new Promise((resolve, reject) => {
    const response = axios({
      url,
      method,
      responseType,
    })
    response.then((res) => {
      resolve(res.data)
    })
    response.catch((err) => {
      reject(err)
    })
  })
}
