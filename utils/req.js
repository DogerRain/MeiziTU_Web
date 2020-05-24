import {baseUrl} from '../api/baseUrl.js'

function request(method, url, data) {
    return new Promise((resolve, reject) => {
        let myheader = {
            token: wx.getStorageSync('token') || '',
        };
        wx.request({
            url: `${baseUrl}${url}`,
            data,
            method,
            header:myheader,
            success(res) {
                console.log(res.data.code);
                if (res.data.code == 200) {
                    resolve(res)//异步成功之后执行的函数
                } else {
                    wx.showToast({
                        // title: res.data.msg || '请求出错',
                        title: '请求出错',
                        icon: 'none',
                        duration: 2000,
                        mask: true
                    });
                    reject(res.ErrorMsg);
                }
                // console.log('req suc', res.data)
            },
            fail(err) {
                // console.log('req err', err)
                reject(err)
            }
        })
    })
}

function get(url, data = {}) {
    return request('GET', url, data)
}

function post(url, data = {}) {
    return request('POST', url, data)
}

module.exports = {
    get,
    post
}