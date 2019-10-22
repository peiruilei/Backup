// pages/userCenter/systemMessage/systemDetail/systemDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system_url:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.system_url)
    this.setData({
      system_url: options.system_url
    })

  },

  
})