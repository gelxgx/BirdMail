// pages/othersEmail/1/othersEmail.js
const db = wx.cloud.database();
const test = db.collection("User");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid:null,
    currentPage: 0,
    totalPage: 2,
    values:[],
    refresh:true,
    none:false,
    shake:true,
},
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.cloud.callFunction({
        name:"getOpenid"
      }).then(res =>{
        console.log(res)
        this.setData({
          openid:res.result.openid
        })
        this.getData()
       })
  },
  getData(callback) {
    let openid = this.data.openid
    if (!callback) {
      callback = res => {}
    }
    test.where(db.command.or([
      {
      "_openid":db.command.neq(openid),
      "PowerRead":db.command.neq(true),
    },
    {
      "_openid":db.command.neq(openid),
      "SendComment":db.command.neq(true)
    }
  ])).skip(this.pageData.skip).get().then(res => {
      if(res.data.length==0){
        this.setData({
          none:true
        })
        setTimeout(() => {
          this.setData({
            shake:false
          })
        }, 2000);
      }else{
      let oldData = this.data.values;
      console.log(res)
      this.setData({
        values: oldData.concat(res.data)
      }, res => {
        this.pageData.skip = this.pageData.skip + 20
        callback();
      })}
    })
  },
  pageData: {
    skip: 0
  },
  onBotton(callback){
    let openid = this.data.openid
    if (!callback) {
      callback = res => {}
    }
    test.where({
      "_openid":db.command.neq(openid)
    }).skip(this.pageData.skip).get().then(res => {
      if(res.data.length==0){
        wx.showToast({
          title: '没有新的信件啦~',
          icon:"none"
        })
      }else{
      let oldData = this.data.values;
      console.log(res)
      this.setData({
        values: oldData.concat(res.data)
      }, res => {
        this.pageData.skip = this.pageData.skip + 20
        callback();
      })}
    })
  },
  refresh(){
    this.setData({
      refresh:false
    })
    test.where(db.command.or([
      {
      "_openid":db.command.neq(this.data.openid),
      "PowerRead":db.command.neq(true),
    },
    {
      "_openid":db.command.neq(this.data.openid),
      "SendComment":db.command.neq(true)
    }
  ])).get().then(res =>{
      if(res.data.length==0){
        setTimeout(() => {
          this.setData({
            values:[],
            none:true,
            refresh:true,
            shake:true
          })
        }, 1000);
        setTimeout(() => {
          this.setData({
            shake:false
          })
        }, 2000);
      }else{
        console.log(res)
        this.setData({
          values: res.data,
          refresh:true ,
          none:false,
          shake:false
        })}
        this.pageData.skipData = 20
      })

  },
  getSelectItem:function(e){
    var that = this;
    var itemWidth = e.detail.scrollWidth / that.data.values.length;
    var scrollLeft = e.detail.scrollLeft;
    var curIndex = Math.round(scrollLeft / itemWidth);
    for (var i = 0, len = that.data.values.length; i < len; ++i) {
        that.data.values[i].selected = false;
    }
    that.data.values[curIndex].selected = true;
    that.setData({
        values: that.data.values,
    });
},
})