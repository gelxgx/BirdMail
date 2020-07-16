// pages/writedContent/writedContent.js
const db = wx.cloud.database()
const test = db.collection("User")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:{},
    isShow:false,
    haveComment:false,
    havePower:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  pageData:{
    id:null
  },
  onLoad: function (options) {
    this.pageData.id = options.id
    test.doc(options.id).get().then(res =>{
      console.log(res)
      this.setData({
        value:res.data
      })
      this.CheckMsg()
    })
  },
  delete(){
    let that = this
    wx.showModal({
      content:"确定删除这封信吗？",
      success (res) {
        if (res.confirm) {
          that.deleteCheck()
        } else if (res.cancel) {
        }
      }
    })
  },
  deleteCheck(){
    test.where({
      "_id":this.pageData.id
    }).remove().then(() =>{
      wx.navigateBack({
        delta:1
      })
    })
  },
  isShow:function(){
    this.setData({
      isShow:!this.data.isShow
    })
  },
  CheckMsg(){
    test.where({
      "_id":this.pageData.id,
      "Comment":db.command.neq(null)
    }).count().then(res =>{
      if(res.total!=0){
        this.setData({
          haveComment:true
        })
      }
    })
    test.where({
      "_id":this.pageData.id,
      "PowerRead":true
    }).count().then(res =>{
      if(res.total!=0){
        this.setData({
          havePower:true
        })
      }
    })
  }
})