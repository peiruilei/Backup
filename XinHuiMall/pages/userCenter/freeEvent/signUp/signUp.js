const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var http = require('../../../userCenter/shoppingCart/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delete_popup:imagePath+app.globalData.delete_popup,
    apply_success: imagePath + app.globalData.apply_success,
    activity_id:0,
    isPopUp:false
  },

  onLoad: function (options) {
    this.setData({
      activity_id: options.activity_id
    })
  },
  onShow: function () {

  },
  //姓名
  nameInput(e){
    this.setData({
      name:e.detail.value
    })
  },
  //手机号码
  telInput(e) {
    this.setData({
      tel: e.detail.value
    })
  },
  //遮罩
  onPopUp(){
    this.setData({
      isPopUp:!this.data.isPopUp
    })
  },
  //立即体验
  onQuick(){
    wx.navigateBack({
      delta:2
    })
  },
  //提交
  oninfoSubmit(){
    var that = this
    if (!that.data.name) {
      wx.showToast({
        title: '请输入您的真实姓名',
        icon: 'none'
      })
      return
    }
    if (!that.data.tel) {
      wx.showToast({
        title: '请输入您的手机号码',
        icon: 'none'
      })
      return
    }
    this.getSubmit()
  },
  getSubmit() {
    var that = this
    var data = {
      v: app.globalData.v,
      activity_id: that.data.activity_id,
      user_name:that.data.name,
      tel_phone:that.data.tel,
      user_id: wx.getStorageSync("user_id")
    }
    http.postReq('activityapplyadd', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        that.setData({
          isPopUp: !that.data.isPopUp
        })
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  }
})