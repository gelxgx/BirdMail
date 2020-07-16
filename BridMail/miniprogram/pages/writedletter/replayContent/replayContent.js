// pages/writedContent/writedContent.js
const db = wx.cloud.database()
const test = db.collection("User")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:{},
    isShow:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  pageData:{
    id:null
  },
  onUnload(){
    let pages = getCurrentPages()
    let beforepages = pages[pages.length-2]
    console.log(beforepages)
    if(beforepages.route=="pages/getletter/getletter"){
      beforepages.onRefresh()
    }
  },
  onLoad: function (options) {
    this.pageData.id = options.id
    test.doc(options.id).get().then(res =>{
      console.log(res)
      this.setData({
        value:res.data
      })
    })
    wx.cloud.callFunction({
      name:"addreaded",
      data:{
        id:options.id,
        isRead:true
      }
    })

  },
  isShow:function(){
    this.setData({
      isShow:!this.data.isShow
    })
  }

})