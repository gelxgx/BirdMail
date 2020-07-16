// miniprogram/pages/write/write.js
const utils = require('../../utils/util.js')
const db = wx.cloud.database()
const test = db.collection("User")
const app =getApp()
const currenTime = utils.formaDate(new Date());
Page({
  data: {
    min: 15,//最少字数
    max: 1000, //最多字数 
    currentWordNumber:0,
    writeTop:null,
  },
  onLoad(){
    this.CheckRiter()
  },
 async bsb(e){
   let len = parseInt(e.detail.value.textarea.length);
   wx.showLoading({
     title: '正在包装你的信件',
   })
   setTimeout(()=>{
    wx.hideLoading({
    })
   },2000)
   if(len <= this.data.min){
    wx.showToast({
      title: "多写几句吧~",
      image:"../../images/sb.png"
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
      if(res.data.Response.EvilTokens.length!=0){
        wx.showToast({
          title: '内容有违规词汇',
          image:"../../images/sad.png"
        })
      }else{
      let currenTime = utils.formaDate(new Date());
    test.add({
      data:{
        value:e.detail.value.textarea,
        authorId:app.globalData.openId,
        author:app.globalData.userInfo.nickName,
        authorIcon:app.globalData.userInfo.avatarUrl,
        Date:currenTime
      }
    }).then(res=>{
      wx.showToast({
        title: "信件已发送啦！",
        image:"../../images/xf.png"
      })
      setTimeout(()=>{
        wx.hideToast()
      },800)
      setTimeout(()=>{
        wx.navigateBack({
          delta:1
        })
      },1500)
    })
    }
    })}else{
    wx.showToast({
      title: "太多内容啦！",
      image:"../../images/sb.png"
    })
    setTimeout(()=>{
      wx.hideToast()
    },800)
   }
 },
 //检查每日上限
 CheckRiter(){
  test.where({
    "Date":currenTime,
    "authorId":app.globalData.openId,
  }).count().then(res =>{
    if(res.total>4){
      wx.showToast({
        title: '今天写信次数以达上限，请明天再来吧~',
        icon:"none"
      })
      setTimeout(()=>{
        wx.navigateBack({
          delta:1
        })
      },1500)
    }else{

    }
  })
 },
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    let value = e.detail.value;
    // 获取输入框内容的长度
    let len = parseInt(value.length);
    this.setData({
      currentWordNumber: len //当前字数  
    });
  },
})
