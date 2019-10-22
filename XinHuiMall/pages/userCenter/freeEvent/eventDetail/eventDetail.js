const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var http = require('../../../userCenter/shoppingCart/http.js')
var WxParse = require('../../../../wxParse/wxParse.js');
Page({
  data: {
    event_detail_icon: imagePath + app.globalData.event_detail_icon,
    event_detail_top_bg:imagePath+app.globalData.event_detail_top_bg,
    activity_id:0,
    activityInfo:{}
  },
  onLoad: function (options) {
    console.log(options.activity_id)
    this.setData({
      activity_id: options.activity_id
    })
  },
  onShow: function () {
    this.getPageData()
  },
  //报名
  onsubmit(){
    wx.navigateTo({
      url: '/pages/userCenter/freeEvent/signUp/signUp?activity_id='+this.data.activity_id,
    })
  },
  getPageData() {
    var that = this
    var data = {
      v: app.globalData.v,
      activity_id: that.data.activity_id,
      user_id:wx.getStorageSync('user_id')
    }
    http.postReq('activitydetail', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        var activityInfo = modelUtils.getModel(res.result)
        console.log(activityInfo)
        WxParse.wxParse('article', 'html', activityInfo.activity_details, that, 0)
        that.setData({
          activityInfo: activityInfo
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