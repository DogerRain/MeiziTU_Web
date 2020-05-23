import api from '../../api/api.js'
import {requestUrl} from "../../utils/util";
import {post} from "../../utils/req";

Page({
    data: {
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function (options) {


    },

    bindGetUserInfo: function (e) {//点击的“拒绝”或者“允许
        if (e.detail.userInfo) {//点击了“允许”按钮，
            var that = this;

             let paramData = {
                 token: wx.getStorageSync('token'),
                 openid: wx.getStorageSync('openid'),//用户的唯一标识
                 nickName: e.detail.userInfo.nickName,//微信昵称
                 avartar: e.detail.userInfo.avatarUrl,//微信头像
                 province: e.detail.userInfo.province,//用户注册的省
                 city: e.detail.userInfo.city//用户注册的市
             };
             /*

             post(api.init, paramData).then(res => {
                 // 这一步我设置的是当进入tabBar页面（除了首页)获取授权后会停留在当前界面；而进入到某个详情页面也就是除了tabBar页面授权之后会返回上一页。
                 let pages = getCurrentPages();
                 if (pages.length) {
                     if (pages.length == 1) {
                         wx.switchTab({
                             url: '../index/index', // 个人中心页面为my，名字随便起
                         })
                     } else {
                         wx.navigateBack({
                             delta: 1,
                         })
                     }
                 }
             }).catch((errorMsg) => {
                 console.log(errorMsg)
             });*/

             requestUrl({//将用户信息传给后台数据库
                url: api.authorizeGetUserInfo  ,
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
                    }else {
                        wx.navigateBack({
                            delta: 1,
                        })
                    }
                }
            }).catch((errorMsg) => {
                console.log("报错"+errorMsg)
            })

            wx.setStorageSync('userInfo', e.detail.userInfo) // 存储用户信息

        } else {
            wx.redirectTo({
                url: '../index/index',//拒绝也可以进去
            })
            /*wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {

                    if (res.confirm) {
                    }else {

                    }
                }
            })*/
        }
    },

})
