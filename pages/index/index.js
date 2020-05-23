import {get, post} from '../../utils/req.js'
import api from '../../api/api.js'
import {initToken, requestUrl} from "../../utils/util";


//获取应用实例
const app = getApp()

Page({
    data: {
        motto: 'Hello World',
        userInfo: {},
        resdata: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),

        indicatorDots: true,
        autoplay: true,
        interval: 3000,
        duration: 100,

    },
    //事件处理函数
    bindViewTap: function () {
        wx.navigateTo({
            url: '../logs/logs'
        })
    },

    onLoad: function () {
        this.getRandomPictures();
    },


    isUserAuthorise(){
        // wx.setStorageSync('openid', res.data.openid);

        return true;
    },


    getRandomPictures() {
        var that = this;
        let requestData = {};
        requestUrl({//将用户信息传给后台数据库
            url: api.getRandomPictures,
            requestData
        }).then((res) => {
            console.log(res.data);
            that.setData({
                resdata: res.data.data
            });
        }).catch((errorMsg) => {
            console.log("报错", errorMsg)
        })
    },

    gotoPicture: function () {
        wx.navigateTo({
            url: '/pages/pictures/test',
        })
    }

})
