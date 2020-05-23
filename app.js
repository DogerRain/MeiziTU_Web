import {getUserInfo,equestUrl, initToken,checkoutToken} from './utils/util.js'
import api from './api/api.js'
import {get, post} from './utils/req.js'

App({
    onLaunch: function () {
        // checkoutToken()
        initToken();

    },

    //检验授权的方法
    getSettings: function () {
        let that = this
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo']) {//授权了，可以获取用户信息了
                    wx.getUserInfo({
                        success: (res) => {
                            console.log("用户授权成功")
                        }
                    })
                } else {//未授权，跳到授权页面
                    wx.redirectTo({
                        url: '../index/index',//授权页面
                    })
                }
            }
        })
    },

    globalData: {
        userInfo: "",//用户信息
        openId: "",//登录用户的唯一标识
        appid: '',//appid
        AppSecret: '',//secret秘钥
        token: ''
    },
    onHide: function () {//小程序退出时触发的事件
        console.log("小程序完全退出了")
    }
})
