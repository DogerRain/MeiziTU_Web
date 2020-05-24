// pages/modelDtail/modelDtail.js
import {requestUrl} from "../../utils/util";
import api from "../../api/api";
import {get, post} from "../../utils/req";

Page({

    /**
     * 页面的初始数据
     */
    data: {},
    modelDetailData: {},
    backgroundImageLink: {},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this;
        var imageId = options.imageId;
        //使用这个作为模糊背景
        var backgroundImageLink = options.imageLink;
        var modelId = options.modelId;
        that.setData({
            backgroundImageLink: backgroundImageLink
        });
        this.getModelHomeBackgroundInfo(modelId);

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    getModelHomeBackgroundInfo(modelId) {
        var that = this;
        let myheader = {
            token: wx.getStorageSync('token') || '',
        };
        let requestData = {'modelId': modelId};
        let method = 'POST';
        // let method ='GET';

       //第一个方法不行，第二个方法可以

        requestUrl({//将用户信息传给后台数据库
            // url: api.getModelHomeBackgroundInfo,
            // url: api.getModelHomeBackgroundInfoGet+"?modelId="+modelId,
            url: api.getModelHomeBackgroundInfo,
            params:requestData,
            method
        }).then((res) => {
            console.log(res.data.data);
            that.setData({
                modelDetailData: res.data.data

            });
            console.log("modelDetailData",this.modelDetailData);
        }).catch((errorMsg) => {
            console.log("报错", errorMsg)
        })


        // wx.request({
        //     url: 'https://meizitu.baimuxym.cn/meizitu/getModelHomeBackgroundInfoPost',
        //     // url: 'https://meizitu.baimuxym.cn/userAPI/getUserInfo',
        //     data: {
        //         modelId: modelId
        //     },
        //     // header: {
        //     //     "content-type": "application/x-www-form-urlencoded"
        //     // },
        //     method: 'POST',
        //     header: myheader,
        //     success: function (res) {
        //         console.log(res.data.data)
        //     }
        // })

        /*
               post(api.getModelHomeBackgroundInfo, requestData).then(res => {
                  console.log(res.data.data)
                }).catch((errorMsg) => {
                    console.log(errorMsg)
                });

                       get(api.getModelHomeBackgroundInfoGet, requestData).then(res => {
                         console.log(res.data.data)
                       }).catch((errorMsg) => {
                           console.log(errorMsg)
                       });*/
    }
})