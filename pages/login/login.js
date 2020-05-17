// import {get, post} from '../../utils/req.js'
import api from '../../api/api.js'

Page({
    /**
     * 页面的初始数据
     */
    data: {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        isHide: false
    },


    bindGetUserInfo: function (e) {
        const userInfo = e.detail.userInfo;
        if (e.detail.userInfo) {
            var that = this;
            wx.login({
                //通过wx.login接口获取到临时code
                success: function (res) {
                    var code = res.code;//发送给服务器的code
                    console.log(res);
                    //将临时code发送到后端
                    if (code) {
                        wx.request({
                            // url: api.host + api.userLogin,
                            url: "127.0.0.1:8888/userAPI/authorizeLogin",
                            data: {
                                code: res.code,
                                nickname: userInfo.nickName,
                                city: userInfo.city,
                                province: userInfo.province,
                                avartar: userInfo.avatarUrl
                            },
                            header: {
                                'content-type': 'application/json'
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log(res);
                            },
                            fail: function () {
                                console.log("000000")
                            }
                        });
                    } else {
                        console.log("获取用户登录态失败！");
                    }

                },
                fail: function (error) {
                    console.log('login failed ' + error);
                }
            });
            //授权成功后,隐藏授权页面
            that.setData({
                isHide: false
            });
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    },


})
