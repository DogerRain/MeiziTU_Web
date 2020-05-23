import api from "../api/api";
import {get, post} from "./req";

const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports = {
    formatTime: formatTime
}


//封装请求
// const server = 'http://127.0.0.1:8888';//正式域名 必须为https
const server = 'http://192.168.1.173:8888';//正式域名 必须为https
const requestUrlUtil = ({url, params, success, method = "post"}) => {
    wx.showLoading({
        title: '加载中',
    });

    let headerGet = {'content-type': 'application/x-www-form-urlencoded'}
    let headerPost = {'content-type': 'application/json'}


    let contentType = method == 'get' ? headerGet : headerPost;
    // if (method=='post'){
    //     contentType = headerPost
    // }else {
    //     contentType=headerGet
    // }

    let myheader = {
        token: wx.getStorageSync('token') || '1',
        contentType
    }

    return new Promise((resolve, reject) => {
        // let myheader ={ method = 'post' ? headerPost : headerGet ,'token': wx.getStorageSync('token')}
        wx.request({
            url: server + url,
            method: method,
            data: params,
            header: myheader,
            success: (res) => {
                wx.hideLoading();
                if (res.data.code == 200) {
                    resolve(res)//异步成功之后执行的函数
                } else {
                    wx.showToast({
                        // title: res.data.msg || '请求出错',
                        title: res.data.msg,
                        icon: 'none',
                        duration: 2000,
                        mask: true
                    })
                    reject(res.ErrorMsg);
                }
            },
            fail: (res) => {
                wx.hideLoading();
                wx.showToast({
                    // title: res.data.msg || '',
                    title: '请求出错',
                    icon: 'none',
                    duration: 2000,
                    mask: true
                })
                reject('网络出错');
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    })
}

const checkoutToken = () => {
    let token = wx.getStorageSync('token');
    console.log("token: ", token);
    if (token == null || token == "") {
        console.log("token为空");
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    console.log('code', res.code);

                    requestUrlUtil({
                        url: api.init,
                        params: {
                            code: res.code
                        }
                    }).then((res) => {
                        console.log("code获取opeid、token成功")
                        wx.setStorageSync('openid', res.data.data.openid);
                        wx.setStorageSync('token', res.data.data.token);
                        // wx.setStorageSync('token', res.data.data.token);
                        // wx.setStorageSync('token', res.data.data.token);
                    }).catch((errorMsg) => {
                        console.log(errorMsg)
                    });
                }
            },
            fail: res => {
                console.log("请求失败")
            }
        })
    } else {
        console.log("token不为空")
        //判断是否授权过的用户
        requestUrlUtil({
            url: api.getUserInfo,
            params: {
                token: wx.getStorageSync('token'),
                openid: wx.getStorageSync('openid'),//用户的唯一标识
            }
        }).then((res) => {
            console.log(res.data.data);
            if (res.data.data == null || res.data.data == '') {
                wx.redirectTo({
                    url: '../pages/login/login',
                })
            } else {
                wx.redirectTo({
                    url: '../pages/index/index',
                })
            }
        });

    }
}

//
const initToken = () => {
    let token = wx.getStorageSync('token');
    console.log("初始化token",token);
    wx.login({
        success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
                console.log('code', res.code);
                requestUrlUtil({
                    url: api.init,
                    params: {
                        code: res.code
                    }
                }).then((res) => {
                    console.log("code获取opeid、token成功")
                    wx.setStorageSync('openid', res.data.data.openid);
                    wx.setStorageSync('token', res.data.data.token);
                }).catch((errorMsg) => {
                    console.log(errorMsg)
                });
            }
        },
        fail: res => {
            console.log("请求失败")
        }
    })
}

const getUserInfo = () => {
    requestUrlUtil({
        url: api.getUserInfo,
        params: {
            openid: wx.getStorageSync('openid'),//用户的唯一标识
        }
    }).then((res) => {
        //查看是否有用户信息，有则表示授权过
        wx.setStorageSync('userInfo', res.data.data);
       return res.data.data.isAuthoriseBefore;
    });
}


//检验code
const checkout = () => {

    wx.checkSession({
        success: function () {
            //token 未过期，并且在本生命周期一直有效
            console.log("token未过期", wx.getStorageSync('token'));
            wx.redirectTo({
                url: '../index/index',//授权页面
            })
        },
        fail: function () {
            //session_key 已经失效，需要重新执行登录流程
            console.log("token过期了", wx.getStorageSync('token'));
            wx.login({
                success: res => {
                    // 发送 res.code 到后台换取 openId, sessionKey, unionId
                    if (res.code) {
                        requestUrl.requestUrl({
                            url: api.init,
                            params: {
                                code: res.code
                            }
                        }).then((res) => {
                            console.log("code获取opeid成功")
                            wx.setStorageSync('openid', res.data.openid);
                            wx.setStorageSync('token', res.data.token);
                            console.log("存储 openid、token 成功")
                            // wx.setStorageSync('token', res.data.data.token);
                            // wx.setStorageSync('token', res.data.data.token);
                        }).catch((errorMsg) => {
                            console.log(errorMsg)
                        })


                    }
                    //跳转？
                }
            })
        }
    })
}

module.exports = {
    requestUrl: requestUrlUtil,
    checkoutToken: checkoutToken,
    initToken: initToken,
    getUserInfo: getUserInfo
}
