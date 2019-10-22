
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
    slash_left: imagePath + app.globalData.slash_left,
    slash_right: imagePath + app.globalData.slash_right,
    shopDetail_address: imagePath + app.globalData.shopDetail_address,
    shopDetail_assess_light: imagePath + app.globalData.shopDetail_assess_light,
    shopDetail_assess: imagePath + app.globalData.shopDetail_assess,
    shopDetail_collect: imagePath + app.globalData.shopDetail_collect,
    shopDetail_nocollect: imagePath + app.globalData.shopDetail_nocollect,
    shopDetail_phone: imagePath + app.globalData.shopDetail_phone,
    orderInfo: {},
    shop_id:0
  },
  onLoad: function (options) {
    console.log(options)
    var shop_id = options.shop_id
    this.setData({
      shop_id:shop_id
    })
  },
  onReady: function () {

  },
  onShow: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        that.getPageData(latitude, longitude)
      }
    })
  },
  //查看大图
  onseeImg(){
    wx.previewImage({
      urls: [this.data.orderInfo.shop_info.big_img] 
    })
  },
//收藏店铺
  onShopCollect(){
    var  mark_type=1
    var is_collect = 1
    if (this.data.orderInfo.shop_info.is_collect!=0){
      mark_type = 2
    }
    var that = this
    var data = {
      collect_type:2,
      key_id:that.data.shop_id,
      mark_type: mark_type,
      user_id: wx.getStorageSync("user_id"),
      v:app.globalData.v
    }
    http.postReq('collectorcancelcollect',data,function(res){
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        wx.showToast({
          title: msg,
        })
        setTimeout(function () {
          wx.getLocation({
            type: 'wgs84',
            success(res) {
              console.log(res)
              const latitude = res.latitude
              const longitude = res.longitude
              that.getPageData(latitude, longitude)
            }
          })
        }, 1500)
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },
  //打电话
  onCall(){
    var telNumber = this.data.orderInfo.shop_info.phone_num
    wx.makePhoneCall({
      phoneNumber: telNumber
    })
  },
  //红包雨
  onRed(){
    wx.navigateTo({
      url: '/pages/index/redEnvelopeList/redEnvelopeList?shop_id='+this.data.shop_id,
    })
  },
  //商品详情
  onGoodsDetail(e) {
    wx.navigateTo({
      url: '/pages/index/goods/goodsDetail/goodsDetail?goods_id=' + e.currentTarget.dataset.goods_id,
    })
  },
  getPageData(latitude, longitude){
    var that = this
    var data = {
      v: app.globalData.v,
      user_id: wx.getStorageSync("user_id"),
      user_lat: latitude,
      user_lng: longitude,
      shop_id: that.data.shop_id
    }
    http.postReq('shopdetail', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        var orderInfo = modelUtils.getModel(res.result)
        
        var point = Math.round(orderInfo.shop_info.service_avggrade)
        orderInfo.shop_info.point = point
        orderInfo.shop_info.distance = (parseFloat(orderInfo.shop_info.distance)).toFixed(2)
        console.log(orderInfo)
        that.setData({
          orderInfo: orderInfo
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