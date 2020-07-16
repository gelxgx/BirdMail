// miniprogram/pages/help/help.js
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    activeNames: ['0'],
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
 
 
})