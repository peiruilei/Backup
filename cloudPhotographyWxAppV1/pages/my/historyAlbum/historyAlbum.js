// pages/ours/historyAlbum/historyAlbum.js
import *as Api from '../../../http/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList: [],
    timeIcon:'../../../static/icons/time_2.png',
    siteIcon:'../../../static/icons/site_2.png',
    noHistory:true,
    noHistoryIcon:'../../../static/icons/noHistory.png',
    pageNum:'1',
    pageSize:'10'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPhotoList()
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

  getPhotoList:function(){
    var that = this
    Api.historyAlbum({
      userId:'1',
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize
    }).then(res =>{
      console.log(res)
      var list = res.result.list
      that.setData({
        photoList:list,
        noHistory:false
      })
    })
  }
})