// pages/writedletter/1/writedletter.js
const db = wx.cloud.database();
const test = db.collection("User");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    refresh:true,
    values: [],
    Comment:[],
    openid:null,
    Date:null,
    show:true,
    noneText:false,
    noneComment:false,
    shake:true
  },
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:"getOpenid"
    }).then(res =>{
      this.setData({
        openid:res.result.openid
      })
      this.getData()
      this.getComment()
    })  
  },
  onShow(){
    test.where({
      "_openid": this.data.openid
    }).get().then(res => {
      this.setData({
        values: res.data,
        refresh:true ,
        noneText:false
      })
      setTimeout(()=>{
        this.setData({
          shake:false
        })
      },2000)
    })
    },
  pageData: {
    skipData: 0,
    skipcomment:0
  },
  getData(callback) {
    let openid = this.data.openid
    if (!callback) {
      callback = res => {}
    }
    test.where({
      "_openid": openid
    }).skip(this.pageData.skipData).get().then(res => {
      if(res.data.length==0){
        this.setData({
          noneText:true
        })
      }else{
        let oldData = this.data.values;
      console.log(res)
      this.setData({
        values: oldData.concat(res.data),
        noneText:false
      }, res => {
        this.pageData.skipData = this.pageData.skipData + 20
        callback();
      })}
    })
  },
  getComment(callback) {
    if (!callback) {
      callback = res => {}
    }
    let openid = this.data.openid
    test.where({
      "reAuthorid": openid,
      "Comment":db.command.neq(null)
    }).skip(this.pageData.skipcomment).get().then(res => {
      if(res.data.length==0){
        this.setData({
          noneComment:true
        })
      }else{
        let oldComment = this.data.Comment;
        this.setData({
          Comment: oldComment.concat(res.data),
          noneComment:false
        }, res => {
          this.pageData.skipComment = this.pageData.skipComment + 20
          callback();
        })}
    })
  },
  BottonComment(callback) {
    let openid = this.data.openid
    if (!callback) {
      callback = res => {}
    }
    test.where({
      "reAuthorid": openid,
      "Comment":db.command.neq(null)
    }).skip(this.pageData.skipComment).get().then(res => {
        let oldComment = this.data.values;
        console.log(res)
        this.setData({
          Comment: oldComment.concat(res.data),
          noneComment:false
        }, res => {
          this.pageData.skipComment = this.pageData.skipComment + 20
          callback();
        })
    })
  },
  BottonData(callback) {
    let openid = this.data.openid
    if (!callback) {
      callback = res => {}
    }
    test.where({
      "_openid": openid
    }).skip(this.pageData.skipData).get().then(res => {
        let oldData = this.data.values;
      console.log(res)
      this.setData({
        values: oldData.concat(res.data),
        noneText:false
      }, res => {
        this.pageData.skipData = this.pageData.skipData + 20
        callback();
      })
    })
  },
  //上拉加载更多数据，并在getData中设置skip跳过数据
  onBottomText: function () {
  this.BottonData()
},
  onBottomComment:function(){
    this.BottonComment()
  },
  //按钮刷新
  refresh(){
    this.setData({
      refresh:false
    })
    if(this.data.active==0){
      this.reflashMine()
    }else{
      this.reflashComment()
    }
  },
  reflashMine(){
    test.where({
      "_openid": this.data.openid
    }).get().then(res => {
      if(res.data.length==0){
        setTimeout(() => {
          this.setData({
            noneText:true,
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
      this.setData({
        values: res.data,
        refresh:true ,
        noneText:false
      })}
      this.pageData.skipData = 20
    })
  },
  reflashComment(){
    test.where({
      "reAuthorid": this.data.openid,
      "Comment":db.command.neq(null)
    }).get().then(res => {
      if(res.data.length==0){
        setTimeout(() => {
          this.setData({
            noneComment:true,
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
      this.setData({
        Comment: res.data,
        refresh:true ,
        noneComment:false
      })}
      this.pageData.skipComment = 20
    })
  },
  //检测切换tab栏
  onChange(event) {
    this.setData({
      active:event.detail.index
    });
  },
})