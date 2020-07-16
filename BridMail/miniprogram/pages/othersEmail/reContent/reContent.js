// pages/reContent/reContent.js
const db = wx.cloud.database();
const utils = require('../../../utils/util.js');
const test = db.collection("User");
const app = getApp()
const currenTime = utils.formaDate(new Date());
Page({
  data: {
    value:{},
    openid:null,
    PowerRead:false,
    PowerTop:null,
    SendComment:false,
    SendCommentTop:null,
    id:null,
    gifShow:false,
    gifShowend:false
  },
  pageData:{
    id:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.pageData.id = options.id
    test.doc(options.id).get().then(res =>{
      this.setData({
        value:res.data,
        id:res.data._id,
        PowerRead:res.data.PowerRead,
        SendComment:res.data.SendComment
      })
    })
    wx.cloud.callFunction({
      name:"getOpenid"
    }).then(res =>{
      this.setData({
        openid:res.result.openid
      })
      this.CheckPower()
     })
  },
  onShow(e){
    test.doc(this.pageData.id).get().then(res =>{
      this.setData({
        value:res.data,
        id:res.data._id,
        PowerRead:res.data.PowerRead,
        SendComment:res.data.SendComment
      })
    })
  },
  onUnload(){
    let pages = getCurrentPages()
    let beforepages = pages[pages.length-2]
    beforepages.refresh()
    
  },
  //添加鼓励
    sendPower(){
     if(this.data.PowerTop<3){
      this.setData({
        PowerRead: true,
        gifShow:true,
        gifShowend:false
      }),
      setTimeout(() => {
        this.setData({
          gifShowend:true
        })
      }, 1700);
      setTimeout(() => {
        this.setData({
         gifShow:false,
        })
      }, 3000);
       wx.cloud.callFunction({
        name:"addPower",
        data:{
          id:this.data.id,
          PowerIcon:app.globalData.userInfo.avatarUrl,
          Date:currenTime,
          openid:this.data.openid
        }
      }).then(()=>{
        
      })
    }else{
      wx.showToast({
        title: '今天已鼓励上限',
        image:"../../../images/sb.png"
      })
    } 
     
    
  },
  //检查是否鼓励、回信上限
  CheckPower(){
    test.where({
      "PowerDate":currenTime,
      "PowerID":this.data.openid
    }).count().then(res =>{
      this.setData({
        PowerTop:res.total
      })
    }),
    test.where({
      "reDate":currenTime,
      "reAuthorid":this.data.openid
    }).count().then(res1 =>{
      this.setData({
        SendCommentTop:res1.total
      })
    })
  },
  check(e){
    if(this.data.SendCommentTop>=2){
      wx.showToast({
        title: '今日回信已上限',
        image:"../../../images/sb.png"
      })
    }else{
        wx.navigateTo({
          url: '../reWriter/reWriter?id='+this.data.id,
        })
    }
  }
})