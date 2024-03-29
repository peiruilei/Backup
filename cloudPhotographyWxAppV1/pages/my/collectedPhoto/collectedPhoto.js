// pages/ours/collectedPhoto/collectedPhoto.js
import *as Api from '../../../http/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoList:[],
    noPhoto:true,
    noPhotoIcon:'../../../static/icons/noPhoto.png',
    pageSize:'10',
    pageNum:'1'
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
  //获取收藏的照片列表数据
  getPhotoList:function(){
    var that = this
    Api.collectedPhoto({
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize,
      userId:'1'
    }).then(res =>{
      console.log(res)
      var list = res.result.list
      that.setData({
        photoList:list,
        noPhoto:false
      })
    })
  }
})