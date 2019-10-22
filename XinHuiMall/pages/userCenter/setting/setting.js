// pages/userCenter/setting/setting.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_back: imagePath + app.globalData.content_back,
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

  //修改密码
  clickPassword:function(){
    wx.navigateTo({
      url: '/pages/userCenter/setting/changePassword/changePassword',
    })
  },

  //关于我们
  clickWe:function(res){
    wx.navigateTo({
      url: '/pages/userCenter/setting/aboutUs/aboutUs' 
    })
  },

  // 退出登录
  LogoutButton:function(){
    wx.clearStorage({
      success: function () {
        wx.reLaunch({
            url: '/pages/index/index',
        })
      }
    })
  }
})