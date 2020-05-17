//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)


        /**
         * 当小程序初始化完成时，对存储的userId进行查询，如果usrId不为空则直接进入首页反之，跳转到登录页面。
         */

        const userId = wx.getStorageSync('token');
        console.log("userIduserIduserIduserId:" + userId);
        if (userId && userId.length != 0) {
            wx.reLaunch({
                url: '/pages/index/index',
            })
        } else {
            wx.reLaunch({
                url: '/pages/login/login',
            })
        }

        // 登录
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
            }
        })
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            this.globalData.userInfo = res.userInfo
                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (this.userInfoReadyCallback) {
                                this.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },
    globalData: {
        userInfo: null,
        URL: 'https://meizitu.baimuxym.cn'
    }
})