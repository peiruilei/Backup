// pages/index/goods/paySuccess/paySuccess.js
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
    slash_left: imagePath+app.globalData.slash_left,
    slash_right: imagePath + app.globalData.slash_right,
    paySuccess_top_bg: imagePath + app.globalData.paySuccess_top_bg,
    orderInfo:{},
    batch_order_sn:'',
    order_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.batch_order_sn){
      this.setData({
        batch_order_sn: options.batch_order_sn
      })
    }
    if (options.order_id) {
      this.setData({
        order_id: options.order_id
      })
    }
    var that = this
    var data = {
      v: app.globalData.v,
      batch_order_sn: that.data.batch_order_sn
    }
    http.postReq('afterpaydetail', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        var orderInfo = modelUtils.getModel(res.result)
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
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
//回到首页
  onBackHome(){
wx.switchTab({
  url: '/pages/index/index',
})
  },
  //查看订单
  onSeeOrder(){
wx.navigateTo({
  url: '/pages/orderList/orderDetail/orderDetail?order_id=' + this.data.order_id,
})
  },
  //商品详情
  onGoodsDetail(e){
    wx.navigateTo({
      url: '/pages/index/goods/goodsDetail/goodsDetail?goods_id=' + e.currentTarget.dataset.goods_id,
    })
  }

})