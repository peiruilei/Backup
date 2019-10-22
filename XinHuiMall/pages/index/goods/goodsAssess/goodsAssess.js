// pages/index/goods/goodsAssess/goodsAssess.js
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
    shopDetail_assess_light: imagePath + app.globalData.shopDetail_assess_light,
    shopDetail_assess: imagePath + app.globalData.shopDetail_assess,
    orderlist: [],
    order_id: 0,
    service_num: 5
  },
  onLoad: function(options) {
    var order_id = options.order_id
    console.log(order_id)
    this.setData({
      order_id: order_id,
    })
  },
  onShow: function() {
    this.getPageData()
  },
  //商品评分
  onshopAssess(e) {
    var shopindex = e.currentTarget.dataset.shopindex
    var index = e.currentTarget.dataset.index
    var path = 'orderlist[' + shopindex + '].goods_num'
    this.setData({
      [path]: index + 1
    })
  },

  //服务评价
  onserviceAssess(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      service_num: index + 1
    })
  },
  //评价提交
  formSubmit(e) {
    var that = this
    var orderlist = this.data.orderlist
    var comment = e.detail.value
    var user_characters = []
    for (let key in comment) {
      if (!comment[key]) {
        wx.showToast({
          title: '请填写评价内容',
          icon: 'none'
        })
        return
      }
      var index = parseInt(key)
      user_characters[index] = '{goods_id :' + orderlist[index].goods_id + ',goods_score:' + orderlist[index].goods_num + ',comment_content : ' + comment[key] + '}'
    }
    console.log(user_characters)
    var data = {
      v: app.globalData.v,
      order_id: that.data.order_id,
      service_score: that.data.service_num,
      comment_list: user_characters,
      user_id: wx.getStorageSync("user_id")
    }
    console.log(data)
    http.postReq('addgoodscomment', data, function(res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 2000
        })
        setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
        }, 2000)
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },
  getPageData(latitude, longitude) {
    var that = this
    var data = {
      v: app.globalData.v,
      order_id: that.data.order_id
    }
    http.postReq('ordergoodslist', data, function(res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        var orderlist = modelUtils.getList(res.result)
        for (var i = 0; i < orderlist.length; i++) {
          orderlist[i].goods_num = 5
        }
        console.log(orderlist)
        that.setData({
          orderlist: orderlist
        })
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },
  onPullDownRefresh() {
    this.getPageData()
  }

})