const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var http = require('../../../userCenter/shoppingCart/http.js')
Page({
  data: {
    showQR_top_bg: imagePath + app.globalData.showQR_top_bg
  },
  onLoad: function (options) {
    console.log(options, wx.getStorageSync('qr_image'))
    this.setData({
      is_use: options.is_use,
      qr_image: wx.getStorageSync('qr_image')
    })
  },
  onShow: function () {

  },
})