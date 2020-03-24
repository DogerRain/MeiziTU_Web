import {baseUrl} from '../api/baseUrl.js'
function request (method, url, data){
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${baseUrl}${url}`,
      data,
      method,
      success (res) {
        // console.log('req suc', res.data)
        resolve(res.data)
      },
      fail (err) {
        // console.log('req err', err)
        reject(err)
      }
    }) 
  })
}

function get (url, data={}){
  return request('GET', url, data)
}
function post (url, data={}){
  return request('POST', url, data)
}

module.exports = {
  get,
  post
}