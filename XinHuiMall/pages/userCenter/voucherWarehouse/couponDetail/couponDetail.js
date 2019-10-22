// pages/userCenter/voucherWarehouse/couponDetail/couponDetail.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var receive_record_id = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon_qr: imagePath + app.globalData.coupon_qr,
    coupon_top_bg: imagePath + app.globalData.coupon_top_bg,
    coupon_navigate: imagePath + app.globalData.coupon_navigate,
    isQR:false,
    couponInfo:{},
    distance:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    receive_record_id = options.receive_record_id
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        that.getPageData(latitude,longitude)
      }
    })
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
  //发放商家
  onshopHome(e){
    wx.navigateTo({
      url: '/pages/index/goods/businessDetails/businessDetails?shop_id='+e.currentTarget.dataset.shop_id,
    })
  },
  // 出示二维码
  onUseQR() {
    this.setData({
      isQR: !this.data.isQR
    })
  },
  //隐藏二维码失效
  onFailQR() {
    return
  },
  getPageData: function (latitude,longitude) {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var that = this
    var para = {}
    para["user_latitude"] = encryptUtils.base64Encode(latitude)
    para["user_longitude"] = encryptUtils.base64Encode(longitude)
    para["receiverecord_id"] = encryptUtils.base64Encode(receive_record_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "redpackdetail",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          var needData = res.data.result
          var coupon_info = modelUtils.getModel(needData)
          console.log(coupon_info)
          var distance = parseFloat(coupon_info.distance)
          distance=(distance).toFixed(2)
          that.setData({
            distance:distance,
            couponInfo: coupon_info
          })
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
  },
  
})