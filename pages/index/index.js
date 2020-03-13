//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    this.getBannerImage();
  },
 
  
  getBannerImage(){
    let url ='localhost:8888/meizitu/getRandomPictures';
    let requestMethond ='GET';
    let requestData = {"modelName":"兰州博物馆1"};
    // app.wxRequest(requestMethond, url, requestData, (res) => {
    //   console.log(res.data)
    //  }, (err) => {
    //   console.log(err.errMsg)
    //  })
    app.wxRequest1(requestMethond,url,requestData);
  },

  gotoPicture: function(){
    wx.navigateTo({
      url: '/pages/pictures/test',
    })
  }

})
