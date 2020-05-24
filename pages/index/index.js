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

        images:{}

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


    goToIndexPages(){
        wx.navigateTo({ url: '/pages/index/index', })
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
    },

    imageLoad: function(e) {
        var $width=e.detail.width,    //获取图片真实宽度
            $height=e.detail.height,
            ratio=$width/$height;    //图片的真实宽高比例
        var viewWidth=718,           //设置图片显示宽度，左右留有16rpx边距
            viewHeight=718/ratio;    //计算的高度值
        var image=this.data.images;


        //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
        image[e.target.dataset.index]={
            width:viewWidth,
            height:viewHeight,

        }
        this.setData({
            images:image
        })
    }

})
