// pages/index/ours/ours.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [{ img: '../../static/icons/browse.png', title: '我浏览过的相册', bindtap:'toHistoryAlbum'}, 
      { img: '../../static/icons/collection.png', title: '我收藏的照片',bindtap:'toCollectedPhoto'}],
    arrow: '../../static/icons/arrow.png',
    index:3
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

  //进入浏览相册页
  toHistoryAlbum:function(){
    wx.navigateTo({
      url: '/pages/my/historyAlbum/historyAlbum',
    })
  },
  
  //进入收藏照片页
  toCollectedPhoto:function(){
    wx.navigateTo({
      url: '/pages/my/collectedPhoto/collectedPhoto',
    })
  }
})