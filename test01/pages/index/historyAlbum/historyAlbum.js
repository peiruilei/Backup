// pages/ours/historyAlbum/historyAlbum.js
import *as Api from '../../../http/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    albumList: [],
    timeIcon:'../../../static/icons/time_2.png',
    siteIcon:'../../../static/icons/site_2.png',
    noHistory:false,
    noHistoryIcon:'../../../static/icons/noHistory.png',
    pageNum:'1',
    pageSize:'10',
    noData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAlbumList()
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
    this.setData({
      pageNum: 1,
      albumList: [],
      noHistory: false,
      noData: false
    })
    this.getAlbumList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.noData) return
    var pageNum = this.data.pageNum + 1
    this.setData({
      pageNum: pageNum
    })
    this.getAlbumList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getAlbumList:function(){
    var that = this
    Api.historyAlbum({
      userId:'1',
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize
    }).then(res =>{
      if (res.result.list.length == 0) {
        if (that.data.pageNum == 1) {
          that.setData({
            noHistory: true
          })
          return
        } else {
          that.setData({
            noData: true
          })
          return
        }
      }
      console.log(res)
      var list = that.data.albumList.concat(res.result.list)
      that.setData({
        albumList:list,
        noHistory:false
      })
    })
  }
})