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
// const server = 'https://meizitu.baimuxym.cn';//正式域名 必须为https
const server = 'http://192.168.1.173:8888';//本地域名 必须为https
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
    let token = wx.getStorageSync('token') || '';

    if (token == '') {
        wx.redirectTo({
            url: '../pages/authoriseLogin/authoriseLogin',
        })
    };

    let myheader = {
        token: wx.getStorageSync('token') || '',
        contentType
    };


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
                }
                else if (res.data.code==400){
                    wx.redirectTo({
                        url: '../pages/authoriseLogin/authoriseLogin',
                    })
                }
                else {
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
    if (token == null || token == "") {
        console.log("初始化token", token);
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
}

const getMyUserInfo = () => {
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

//查看是否授权方法
const isAuthorise = () => {
    wx.getSetting({
        success: function (res) {
            if (res.authSetting['scope.userInfo']) {
                wx.getUserInfo({
                    success: function (res) {
                        // 用户已经授权过,不需要显示授权页面,所以不需要改变 isHide 的值
                        // 根据自己的需求有其他操作再补充
                        // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                        wx.login({
                            success: res => {
                                // 获取到用户的 code 之后：res.code
                                console.log("用户的code:" + res.code);
                                requestUrl({//将用户信息传给后台数据库
                                    url: api.authorizeGetUserInfo,
                                    params: {
                                        token: wx.getStorageSync('token'),
                                        openid: wx.getStorageSync('openid'),//用户的唯一标识
                                        nickName: e.detail.userInfo.nickName,//微信昵称
                                        avartar: e.detail.userInfo.avatarUrl,//微信头像
                                        province: e.detail.userInfo.province,//用户注册的省
                                        city: e.detail.userInfo.city//用户注册的市
                                    }
                                }).then((data) => {
                                    // 这一步我设置的是当进入tabBar页面（除了首页)获取授权后会停留在当前界面；而进入到某个详情页面也就是除了tabBar页面授权之后会返回上一页。
                                    let pages = getCurrentPages();
                                    if (pages.length) {
                                        if (pages.length == 1) {
                                            wx.redirectTo({
                                                url: '../index/index', // 个人中心页面为my，名字随便起
                                            })
                                        } else {
                                            wx.navigateBack({
                                                delta: 1,
                                            })
                                        }
                                    }
                                }).catch((errorMsg) => {
                                    console.log("报错" + errorMsg)
                                })
                            }
                        });
                    }
                });
            } else {
                // 用户没有授权
                // 改变 isHide 的值，显示授权页面
                that.setData({
                    isHide: true
                });
            }
        }
    });
}

module.exports = {
    requestUrl: requestUrlUtil,
    checkoutToken: checkoutToken,
    initToken: initToken,
    getMyUserInfo: getMyUserInfo
}
