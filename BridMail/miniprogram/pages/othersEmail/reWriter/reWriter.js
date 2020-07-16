// pages/reWriter/reWriter.js
const utils = require('../../../utils/util.js');
const db = wx.cloud.database();
const test = db.collection("User");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    value:{},
    min: 15,//最少字数
    max: 1000, //最多字数 
    currentWordNumber:0,
    id:null,
    openid:null
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id:options.id,
    })
    test.where({
      "_id":this.data.id,
      "SendComment":true
    }).count().then(res =>{
      if(res.total==1){
        wx.showToast({
          title: '已有人抢先回信啦，换个人回复吧~',
          icon:"none"
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta:1
          })
        },1500)
      }
    })
   },
  async bsb(e){
    let len = parseInt(e.detail.value.textarea.length);
    wx.showLoading({
      title: '正在装好回信',
    })
    setTimeout(()=>{
     wx.hideLoading({
     })
    },1000)
    if(len <= this.data.min){
     wx.showToast({
       title: "多写几句吧~",
       image:"../../../images/sb.png"
     })
     setTimeout(()=>{
      wx.hideToast()
    },800)
    }else if(len > this.data.min){
      wx.serviceMarket.invokeService({
        service: 'wxee446d7507c68b11',
        api: 'msgSecCheck',
        data: {
          "Action": "TextApproval",
          "Text": e.detail.value.textarea
        },
      }).then(res =>{
        console.log(res)
        if(res.data.Response.EvilTokens.length!=0){
          wx.showToast({
            title: '内容有违规词汇',
            image:"../../../images/sad.png"
          })
        }else{
          let currenTime = utils.formaDate(new Date());
          wx.cloud.callFunction({
            name:"addComment",
            data:{
              id:this.data.id,
              comment:e.detail.value.textarea,
              reAuthorid:app.globalData.openId,
              nickName:app.globalData.userInfo.nickName,
              avatarUrl:app.globalData.userInfo.avatarUrl,
              Date:currenTime,
            }
          }).then(res =>{
            wx.showToast({
              title: "信件已传达到啦！",
              image:"../../../images/xf.png"
            })
            setTimeout(()=>{
              wx.hideToast()
            },800)
            setTimeout(()=>{
              wx.navigateBack({
                delta:1
              })
            },1000)
          })
        }
      })
    }else{
     wx.showToast({
       title: "太多内容啦！",
      image:"../../../images/sb.png"
     })
     setTimeout(()=>{
      wx.hideToast()
    },800)
    }
  },
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    this.setData({
      currentWordNumber: len //当前字数  
    });
    
  },

})