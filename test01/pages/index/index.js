// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    case: '../../static/icons/case.png',
    live: '../../static/icons/live.png',
    my: '../../static/icons/my.png',
    currentindex:1
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

  //跳转到直播合作页
  toOrderShot: function () {
    this.setData({
      currentindex:2
    })
  },
  //跳转到我的页面
  toMy: function () {
    this.setData({
      currentindex: 3
    })
  },
  //跳转到精选案例页
  toIndex: function () {
    this.setData({
      currentindex: 1
    })
  }
})