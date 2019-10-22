// pages/userCenter/shoppingCart/shoppingCartAddOrder/shoppingCartAddOrder.js

const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_back: imagePath + app.globalData.content_back,
    shopping_cart_icon: imagePath + app.globalData.shopping_cart_icon,
    shopping_cart_noselect: imagePath + app.globalData.shopping_cart_noselect,
    shopping_cart_select: imagePath + app.globalData.shopping_cart_select,
    order_info: {},
    consignee: "",
    telphone: "",
    address_id: 0,
    address_detail: "",
    goods_type: 0,
    user_subsidy: 0,
    user_xinhui_point: 0,
    wxCheck: true,
    xinHuiPointCheck: false,
    subsidyCheck: false,
    needPayPrice: 0,
    shop_list: [],
    goodsTotalNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var result = unescape(options.result)
    var orderInfo = JSON.parse(result)

    var address_info = orderInfo.address_info

    if (address_info.user_address_id > 0) {
      this.setData({
        consignee: address_info.consignee,
        telphone: address_info.tel_phone,
        address_id: address_info.user_address_id,
        address_detail: address_info.address_detail,
      })
    }

    var goodsTotalNum = 0
    for (var i = 0; i < orderInfo.shop_list.length; i++) {
      orderInfo.shop_list[i].memo = ""
      orderInfo.shop_list[i].logisticIndex = 0
      for (var j = 0; j < orderInfo.shop_list[i].goods_list.length; j++) {
        goodsTotalNum = goodsTotalNum + parseInt(orderInfo.shop_list[i].goods_list[j].buy_num)
      }
    }

    this.setData({
      goodsTotalNum: goodsTotalNum,
      order_info: orderInfo.order_info,
      shop_list: orderInfo.shop_list,
      user_subsidy: orderInfo.order_info.user_subsidy,
      user_xinhui_point: orderInfo.order_info.user_xinhui_point
    })
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

  // 提交
  sumitPressed: function() {
    var address_id = this.data.address_id
    if (address_id == 0) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none'
      })
      return;
    }

    var orderInfo = this.data.order_info

    var payType = 0
    if (this.data.wxCheck) {
      payType = 1
    } else if (this.data.xinHuiPointCheck) {
      payType = 2
    } else {
      payType = 3
    }

    var shop_list = this.data.shop_list
    var array = []
    for (var i = 0; i < shop_list.length; i++) {
      var carIDs = []
      for (var j = 0; j < shop_list[i].goods_list.length; j++) {
        carIDs.push(shop_list[i].goods_list[j].cart_id)
      }
      var shopLogisticsID = 0
      if (shop_list[i].logistics_type_list.length > 0) {
        shopLogisticsID = shop_list[i].logistics_type_list[shop_list[i].logisticIndex].shop_logistics_id
      } else {
        shopLogisticsID = 0
      }

      array.push(carIDs.join(",") + "&" + shopLogisticsID + "&" + shop_list[i].memo)

    }

    console.log(array.join("|"))

    wx.showLoading({
      title: '请稍等...',
    })

    var para = {}
    para["shop_cart_id_str"] = encryptUtils.base64Encode(array.join("|"))
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["user_address_id"] = encryptUtils.base64Encode(address_id)
    para["pay_type"] = encryptUtils.base64Encode(payType)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "addordershopcart",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        var code = res.data.code
        var msg = res.data.msg
        wx.hideLoading()
        console.log(res)
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)
          if (result.need_price > 0) {
            wx.redirectTo({
              url: 'pages/pay/pay?need_price=' + result.need_price + "&order_no=" + result.order_no + "&order_id=" + result.order_id,
            })
          } else {
            wx.redirectTo({
              url: '/pages/index/goods/paySuccess/paySuccess?order_id=' + result.order_id + "&batch_order_sn=" + result.order_no,
            })
          }
          setTimeout(function() {
            wx.showToast({
              title: msg,
            })
          }, 400)
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      },
      complete: function() {

      }
    })
  },

  // 点击微信
  wxClick: function() {
    this.setData({
      wxCheck: true,
      xinHuiPointCheck: false,
      subsidyCheck: false
    })
  },

  xinHuiClick: function() {
    var userXinHuiPoint = this.data.order_info.user_xinhui_point
    var goodsTotalPoint = this.data.order_info.xinhui_point_total_price

    if (parseInt(userXinHuiPoint) > parseInt(goodsTotalPoint)) {
      this.setData({
        wxCheck: false,
        xinHuiPointCheck: true,
        subsidyCheck: false
      })
    } else {
      wx.showToast({
        title: '昕惠分不足',
        icon: "none"
      })
    }

  },

  subsidyClick: function() {
    var userSubsidy = this.data.order_info.user_subsidy
    var goodsTotalSubsidy = this.data.order_info.subsidy_total_price

    if (parseInt(userSubsidy) > parseInt(goodsTotalSubsidy)) {
      this.setData({
        wxCheck: false,
        xinHuiPointCheck: false,
        subsidyCheck: true
      })
    } else {
      wx.showToast({
        title: '补贴金不足',
        icon: "none"
      })
    }
  },

  //选择快递方式
  bindPickerChange: function(event) {
    var index = event.currentTarget.dataset.index
    var value = event.detail.value
    var shopList = this.data.shop_list
    shopList[index].logisticIndex = value
    this.setData({
      shop_list: shopList
    })
  },



  // 输入备注
  inputMemoPressed: function(event) {
    var index = event.currentTarget.dataset.index
    var shopList = this.data.shop_list
    shopList[index].memo = event.detail.value

    this.setData({
      shop_list: shopList
    })
  },


  // 选择地址
  selectAddressPressed: function() {
    wx.navigateTo({
      url: '/pages/userCenter/address/address?mark=1',
    })
  },


})