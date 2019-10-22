// pages/userCenter/userInfo/userInfo.js
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
    index_arrow: imagePath + app.globalData.index_arrow,
    showNoData: true,
    msg: "请稍等...",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPageData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  // /**
  //  * 用户点击右上角分享
  //  */
  // onShareAppMessage: function () {

  // }
  //绑定手机号
  goToBindPhonePressed: function() {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    var navTitel = this.data.userinfo.login_name.length > 0 ? "修改手机号" : "绑定手机号"
    wx.navigateTo({
      url: '/pages/userCenter/bindPhone/bindPhone?title=' + navTitel,
    })
  },


  //获取页面信息
  getPageData: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync('user_id'))
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "user/userinfo",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        wx.hideLoading()
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)

          that.setData({
            userinfo: result,
            showNoData: false
          })
        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
          that.setData({
            showNoData: true,
            msg: msg,
          })
        }
      },
      fail: function() {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
        that.setData({
          showNoData: true,
          msg: '网络异常',
        })
      },
      complete: function() {}
    })
  },

})