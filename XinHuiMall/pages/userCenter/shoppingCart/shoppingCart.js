// pages/userCenter/shoppingCart/shoppingCart.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var http = require('http.js')
var user_id = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_use: imagePath + app.globalData.common_no_data,
    shopping_cart_add: imagePath + app.globalData.shopping_cart_add,
    shopping_cart_less: imagePath + app.globalData.shopping_cart_less,
    shopping_cart_noselect: imagePath + app.globalData.shopping_cart_noselect,
    shopping_cart_select: imagePath + app.globalData.shopping_cart_select,
    shopping_cart_icon: imagePath + app.globalData.shopping_cart_icon,
    shopInfo: {},
    invalid_shop_cart_list:[],
    allSelect: false,
    isEdit: false,
    prices: 0,
    showNoData:false
  },
  onLoad: function(options) {
    user_id = wx.getStorageSync("user_id")
  },
  onShow: function() {
    this.setData({
      allSelect: false
    })
    this.getPageData()
  },
  onUnload: function() {

  },
  // 编辑商品
  onEditShop() {
    this.setData({
      isEdit: !this.data.isEdit
    })
  },
  //商家详情
  onshopDetails(e){
    var shop_id = e.currentTarget.dataset.shop_id
    wx.navigateTo({
      url: '/pages/index/goods/businessDetails/businessDetails?shop_id='+shop_id,
    })
  },
  //商品详情
  onshopDetail(e){
    var goods_id = e.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/index/goods/goodsDetail/goodsDetail?goods_id=' + goods_id,
    })
  },
  //全选
  onselectAll() {
    var that = this
    var shopInfo = that.data.shopInfo
    var allSelect = that.data.allSelect
    for (var i = 0; i < shopInfo.shop_cart_list.length; i++) {
      shopInfo.shop_cart_list[i].shopIsSelect = !allSelect
      for (var j = 0; j < shopInfo.shop_cart_list[i].goods_list.length; j++) {
        shopInfo.shop_cart_list[i].goods_list[j].goodsIsSelect = !allSelect
      }
    }
    that.setData({
      shopInfo: shopInfo,
      allSelect: !allSelect
    })
    that.sumPrice()
  },
  // 选择店铺
  onselectShop(e) {
    var that = this
    var shop_allSelect = true
    var shop_index = e.currentTarget.dataset.shop_index
    var shopInfo = that.data.shopInfo
    var shop_path = 'shopInfo.shop_cart_list[' + shop_index + '].shopIsSelect'
    var shopIsSelect = shopInfo.shop_cart_list[shop_index].shopIsSelect
    for (var i = 0; i < shopInfo.shop_cart_list[shop_index].goods_list.length; i++) {
      let goods_path = 'shopInfo.shop_cart_list[' + shop_index + '].goods_list[' + i + '].goodsIsSelect'
      that.setData({
        [goods_path]: !shopIsSelect
      })
    }
    shopInfo.shop_cart_list[shop_index].shopIsSelect = !shopIsSelect
    for (var i = 0; i < shopInfo.shop_cart_list.length; i++) {
      shop_allSelect = shop_allSelect && shopInfo.shop_cart_list[i].shopIsSelect
    }
    that.sumPrice()
    that.setData({
      [shop_path]: !shopIsSelect,
      allSelect: shop_allSelect
    })
  },
  //选择商品
  onselectGoods(e) {
    var that = this
    var shop_select = true
    var shop_allSelect = true
    var shop_index = e.currentTarget.dataset.shop_index
    var goods_index = e.currentTarget.dataset.goods_index
    var shopInfo = that.data.shopInfo
    var shop_path = 'shopInfo.shop_cart_list[' + shop_index + '].shopIsSelect'
    var goods_path = 'shopInfo.shop_cart_list[' + shop_index + '].goods_list[' + goods_index + '].goodsIsSelect'
    var goodsIsSelect = shopInfo.shop_cart_list[shop_index].goods_list[goods_index].goodsIsSelect
    shopInfo.shop_cart_list[shop_index].goods_list[goods_index].goodsIsSelect = !goodsIsSelect
    for (var i = 0; i < shopInfo.shop_cart_list[shop_index].goods_list.length; i++) {
      shop_select = shop_select && shopInfo.shop_cart_list[shop_index].goods_list[i].goodsIsSelect
    }
    for (var i = 0; i < shopInfo.shop_cart_list.length; i++) {
      for (var j = 0; j < shopInfo.shop_cart_list[i].goods_list.length; j++) {
        shop_allSelect = shop_allSelect && shopInfo.shop_cart_list[i].goods_list[j].goodsIsSelect
      }
    }
    that.setData({
      [goods_path]: !goodsIsSelect,
      [shop_path]: shop_select,
      allSelect: shop_allSelect
    })
    that.sumPrice()
  },
  //改变商品数量
  onShopChange(e) {
    var that = this
    var status = e.currentTarget.dataset.status
    var shop_index = e.currentTarget.dataset.shop_index
    var goods_index = e.currentTarget.dataset.goods_index
    var shopInfo = that.data.shopInfo
    var cart_id = shopInfo.shop_cart_list[shop_index].goods_list[goods_index].cart_id
    var num_path = 'shopInfo.shop_cart_list[' + shop_index + '].goods_list[' + goods_index + '].buy_num'
    var goodsIsSelect = shopInfo.shop_cart_list[shop_index].goods_list[goods_index].goodsIsSelect
    if (status == 1) {
      var buy_num = parseInt(shopInfo.shop_cart_list[shop_index].goods_list[goods_index].buy_num) + 1
      var data = {
        user_id: user_id,
        v: app.globalData.v,
        cart_id: cart_id,
        buy_num: buy_num
      }
      http.postChangeNum('editshopcart', data, function(res) {
        console.log(res)
        var code = res.code
        var msg = res.msg
        if (code == 100) {
          console.log(buy_num)
          that.setData({
            [num_path]: buy_num
          })
          if (goodsIsSelect) {
            that.sumPrice()
          }
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      })
    } else {
      var buy_num = parseInt(shopInfo.shop_cart_list[shop_index].goods_list[goods_index].buy_num) - 1
      if (buy_num > 0) {
        var data = {
          user_id: user_id,
          v: app.globalData.v,
          cart_id: cart_id,
          buy_num: buy_num
        }
        http.postChangeNum('editshopcart', data, function(res) {
          console.log(res)
          var code = res.code
          var msg = res.msg
          if (code == 100) {
            console.log(buy_num)
            that.setData({
              [num_path]: buy_num
            })
            if (goodsIsSelect) {
              that.sumPrice()
            }
          } else {
            wx.showToast({
              title: msg,
              icon: 'none',
            })
          }
        })
      }
    }
  },
  //删除商品
  onshop_delete() {
    var that = this
    var shopInfo = that.data.shopInfo
    var goods_arr = []
    for (var i = 0; i < shopInfo.shop_cart_list.length; i++) {
      for (var j = 0; j < shopInfo.shop_cart_list[i].goods_list.length; j++) {
        var goods_price = parseFloat(shopInfo.shop_cart_list[i].goods_list[j].goods_price)
        if (shopInfo.shop_cart_list[i].goods_list[j].goodsIsSelect) {
          goods_arr.push(shopInfo.shop_cart_list[i].goods_list[j].cart_id)
        }
      }
    }
    if (goods_arr.length == 0) {
      wx.showToast({
        title: '请选择需要删除的商品',
        icon: 'none'
      })
      return
    }
    wx.showModal({
      title: '提示',
      content: '确定要删除商品吗？',
      success(res) {
        if (res.confirm) {
          console.log(goods_arr.join(','))
            var data = {
              user_id: user_id,
              v: app.globalData.v,
              cart_ids: goods_arr.join(',')
            }
            http.postReq('batchdeleteshopcart', data, function (res) {
              console.log(res)
              var code = res.code
              var msg = res.msg
              if (code == 100) {
                setTimeout(function () {
                  wx.showToast({
                    title: msg,
                  })
                }, 100)
                that.getPageData()
              } else {
                wx.showToast({
                  title: msg,
                  icon: 'none',
                })
              }
            })
        }
      }
    })
  },
  //清空失效商品
  onshopClear(){
    var that = this
    var invalid_shop_cart_list = that.data.invalid_shop_cart_list
    var goods_arr = []
    for (var i = 0; i < invalid_shop_cart_list.length;i++){
      goods_arr.push(invalid_shop_cart_list[i].cart_id)
    }
    wx.showModal({
      title: '提示',
      content: '确定要清空失效商品吗？',
      success(res) {
        if (res.confirm) {
          console.log(goods_arr.join(','))
          var data = {
            user_id: user_id,
            v: app.globalData.v,
            cart_ids: goods_arr.join(',')
          }
          http.postReq('batchdeleteshopcart', data, function (res) {
            console.log(res)
            var code = res.code
            var msg = res.msg
            if (code == 100) {
              setTimeout(function () {
                wx.showToast({
                  title: msg,
                })
              }, 100)
              that.getPageData()
            } else {
              wx.showToast({
                title: msg,
                icon: 'none',
              })
            }
          })
        }
      }
    })
  },
  //结算
  settleAccounts(){
    var that = this
    var shopInfo = that.data.shopInfo
    var goods_arr = []
    for (var i = 0; i < shopInfo.shop_cart_list.length; i++) {
      for (var j = 0; j < shopInfo.shop_cart_list[i].goods_list.length; j++) {
        var goods_price = parseFloat(shopInfo.shop_cart_list[i].goods_list[j].goods_price)
        if (shopInfo.shop_cart_list[i].goods_list[j].goodsIsSelect) {
          goods_arr.push(shopInfo.shop_cart_list[i].goods_list[j].cart_id)
        }
      }
    }
    if (goods_arr.length == 0) {
      wx.showToast({
        title: '请选择商品',
        icon: 'none'
      })
      return
    }
  //   console.log(goods_arr.join(','))
  //  wx.navigateTo({
  //    url: '?goods_arr=' + goods_arr.join(','),
  //  })

    wx.showLoading({
      title: '请稍等...',
    })
    var that = this
    var para = {}
    para["cart_ids"] = encryptUtils.base64Encode(goods_arr.join(','))
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "orderconfirmshopcart",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)
          var resultDetail = JSON.stringify(result)
          var resultDetail1 = escape(resultDetail)
          console.log(resultDetail)
          wx.navigateTo({
            url: '/pages/userCenter/shoppingCart/shoppingCartAddOrder/shoppingCartAddOrder?result=' + resultDetail1,
          })
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      },
      complete: function () {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })



  },
  // 获取页面数据
  getPageData: function() {
    var that = this
    var data = {
      user_id: user_id,
      v: app.globalData.v
    }
    http.postReq('shopcartlist', data, function(res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        var shop_info = modelUtils.getModel(res.result)
        if (shop_info.shop_cart_list.length == 0 && shop_info.invalid_shop_cart_list.length == 0 ){
          that.setData({
            showNoData:true
          })
        }else{
          var invalid_shop_cart_list = []
          for (var i = 0; i < shop_info.shop_cart_list.length; i++) {
            shop_info.shop_cart_list[i].shopIsSelect = false
            for (var j = 0; j < shop_info.shop_cart_list[i].goods_list.length; j++) {
              shop_info.shop_cart_list[i].goods_list[j].goodsIsSelect = false
            }
          }
          for (var i = 0; i < shop_info.invalid_shop_cart_list.length; i++) {
            invalid_shop_cart_list = invalid_shop_cart_list.concat(shop_info.invalid_shop_cart_list[i].goods_list)
          }
          console.log(shop_info, invalid_shop_cart_list)
          that.setData({
            shopInfo: shop_info,
            invalid_shop_cart_list: invalid_shop_cart_list,
            prices: 0
          })
        }
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },
  //计算价格
  sumPrice() {
    var that = this
    var shopInfo = that.data.shopInfo
    var price = 0
    for (var i = 0; i < shopInfo.shop_cart_list.length; i++) {
      for (var j = 0; j < shopInfo.shop_cart_list[i].goods_list.length; j++) {
        var goods_price = parseFloat(shopInfo.shop_cart_list[i].goods_list[j].goods_price)
        if (shopInfo.shop_cart_list[i].goods_list[j].goodsIsSelect) {
          price = price + goods_price * parseInt(shopInfo.shop_cart_list[i].goods_list[j].buy_num)
        }
      }
    }
    that.setData({
      prices: price.toFixed(2)
    })
  }
})