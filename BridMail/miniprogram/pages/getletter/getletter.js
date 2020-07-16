const db = wx.cloud.database();
const test = db.collection("User");
Page({
  data: {
    refresh:true,
    triggered: true,
    length:null,
    values: [],
    openid:null,
    showFlower:false,
    isRead:false,
    noneText:false,
    shake:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
 
  onLoad: function (options) {
    wx.cloud.callFunction({
      name:"getOpenid"
    }).then(res =>{
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
    test.where({
      "_openid":openid,
      "Comment":db.command.neq(null)
       }).skip(this.pageData.skip).get().then(res => {
      if(res.data.length==0){
        this.setData({
          noneText:true
        })
        setTimeout(()=>{
          this.setData({
            shake:false,
          })
        },2000)
      }else{
        let oldData = this.data.values;
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

  //下拉刷新
  onRefresh() {
    let openid = this.data.openid
    test.where({
        "_openid":openid,
      "Comment":db.command.neq(null)
      }).get().then(res => {
        console.log(res)
        if(res.data.length==0){
          this.setData({
            noneText:true,
            triggered: false,
          })
          setTimeout(()=>{
            this.setData({
              shake:true
            })
          },300)
          setTimeout(()=>{
            this.setData({
              shake:false
            })
          },2000)
        }else{
          this.setData({
            values: res.data,
            triggered: false,
            noneText:false
          })
        }
    })
  },
   //下拉刷新收回时重置skip数值
   onStore: function (e) {
    this.pageData.skip = 20
    console.log(this.pageData.skip)
    
  },
   //上拉加载更多数据，并在getData中设置skip跳过数据
   onBottom: function () {
    this.getData();
  },
})