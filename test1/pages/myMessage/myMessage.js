// pages/myMessage/myMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageList:[{title:'购免单隆重开业', content:'爆款8折起', state:'0'},
      { title: '购免单隆重开业', content: '爆款8折起', state: '1' },
      { title: '购免单隆重开业', content: '爆款8折起', state: '1' }],
    arrow: '../../static/arrow.png',
    covre: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  openWindow:function(){
    var that = this
    this.setData({
      covre:true
    })
  },

  closeWindow:function(){
    this.setData({
      covre: false
    })
  }
})