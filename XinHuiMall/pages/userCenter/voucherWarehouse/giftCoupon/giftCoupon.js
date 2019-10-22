// pages/userCenter/voucherWarehouse/giftCoupon/giftCoupon.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var http = require('../../shoppingCart/http.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon_qr: imagePath + app.globalData.coupon_qr,
    coupon_top_bg: imagePath + app.globalData.coupon_top_bg,
  },
  onLoad: function (options) {
    var that = this
    // wx.getStorage({
    //   key: 'voucher',
    //   success: function(res) {
    //     that.setData({
    //       voucher:res.data
    //     })
    //   },
    // })
    that.setData({
      receive_record_id: options.receive_record_id
    })
  },
  onShow: function () {
    this.getPageData()
  },
  //转正人ID
  oninputID(e){
    this.setData({
      acceptuser_user_account:e.detail.value
    })
  },
//查看商家
  onSeeMerchant(e){
    wx.navigateTo({
      url: '/pages/index/goods/businessDetails/businessDetails?shop_id=' + e.currentTarget.dataset.shop_id,
    })
  },
  //确认赠送
  onsubmit(){
    if (!this.data.acceptuser_user_account){
      wx.showToast({
        title: '请输入转赠人ID',
        icon:'none'
      })
      return
    }
    this.getSubmit()
  },
  getSubmit() {
    var that = this
    var data = {
      v: app.globalData.v,
      acceptuser_user_account: that.data.acceptuser_user_account,
      sourceuser_id: wx.getStorageSync("user_id") ,
      receiverecord_id: that.data.receive_record_id
    }
    http.postReq('redpackgive', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
        setTimeout(function(){
          wx.navigateBack({
            delta:1
          })
        },2000)
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },
  getPageData() {
    var that = this
    var data = {
      v: app.globalData.v,
      user_latitude: 0,
      user_longitude: 0,
      receiverecord_id: that.data.receive_record_id
    }
    http.postReq('redpackdetail', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        var needData = res.result
        var coupon_info = modelUtils.getModel(needData)
        console.log(coupon_info)
        that.setData({
          couponInfo: coupon_info
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