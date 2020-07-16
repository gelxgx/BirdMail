//index.js
const utils = require('../../utils/util.js')
const db = wx.cloud.database();
const User = db.collection("User");
const app =getApp()

Page({
  data: {
    isShow:false,
    lbShow:true,
    show:false,
    lbOutAnimated:false,
    bgAnimated:false,
    bgNight:false,
    bgShow:false,
    helpAnimated:false,
    writeAnimated:false,
    EmailAnimated:false,
    postAnimated:false,
    NewAnimated:false,
    openid:null,
    dataCount:0,
    hasUserInfo: false,
    New:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    write:{
      url: "../write/write",
      content:"您必须授权才能抒发感情噢~"
    },
    writedletter:{
      url: "../writedletter/writedletter",
      content:"您必须授权才能查看我的内容噢~"
    },
    post:{
      content:"您必须授权才能查看他人噢~"
    }
    },
    onShow:function(){
      wx.cloud.callFunction({
        name:"getOpenid"
      }).then(res =>{
        this.setData({
          openid:res.result.openid
        })
        this.New()
      })
      let hour = utils.hours(new Date());
      if(hour>17||hour<8){
      this.setData({
        bgNight:true
      })
    }  
    },
  onLoad: function(options) {
    this.CheckUserInfo()
    
  },
//控制木板是否显示
  isShow(){
    this.setData({
      isShow: !this.data.isShow,
      show: !this.data.show
    })
  },

//控制轮播图是否显示
  lbShow:function(){
    this.setData({
      lbOutAnimated:true
    })
    setTimeout(() => {
      this.setData({
        lbShow:!this.data.lbShow
      })
    }, 1000);
    setTimeout(() => {
      this.setData({
        bgAnimated:true,
        bgShow:true
      })
    },200);
    setTimeout(() => {
      this.setData({
        helpAnimated:true
      })
    },200);
    setTimeout(() => {
      this.setData({
        writeAnimated:true
      })
    },400);
    setTimeout(() => {
      this.setData({
        EmailAnimated:true
      })
    },500);
    setTimeout(() => {
      this.setData({
        postAnimated:true
      })
    },600);
    setTimeout(() => {
      this.setData({
        NewIcon:true
      })
    },600);
    if(this.data.New=true){
      setTimeout(() => {
        this.setData({
          NewAnimated:true
        })
      },600);
    }
  },
  //检查是否已经授权
  CheckUserInfo(){
    if (app.globalData.userInfo) {
      //全局应用已有用户信息 
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回 
      // 所以此处加入 callback 以防止这种情况 
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理 
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
//获取用户信息
  getUserInfo: function (e) {
    if (e.detail.errMsg != "getUserInfo:fail auth deny") {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      });
      wx.navigateTo({
        url: e.currentTarget.dataset.id.url
      });
    }else {
      wx.showModal({
        title: '提示',
        content: e.currentTarget.dataset.id.content,
        showCancel: false,
      })
    }
  },
  getIconUserInfo: function (e) {
    if (e.detail.errMsg != "getUserInfo:fail auth deny") {
      app.globalData.userInfo = e.detail.userInfo;
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true,
        isShow: !this.data.isShow
      });
    }else {
      wx.showModal({
        title: '提示',
        content: e.currentTarget.dataset.id.content,
        showCancel: false,
      })
    }
  },
  New:function(){
    User.where({
      "authorId":this.data.openid,
      "isRead":false
    }).count().then(res =>{
      if(res.total!=0){
        this.setData({
          New:true
        })
      }else{
        this.setData({
          New:false
        })
      }
    })
  }
})
