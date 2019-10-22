// pages/index/goods/addOrder/addOrder.js
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
    goods_type:0,
    user_subsidy:"",
    user_xinhui_point:0,
    wxCheck:true,
    xinHuiPointCheck:false,
    subsidyCheck: false,
    needPayPrice:0,
    memo:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var result = unescape(options.result)
    var order_info = JSON.parse(result)
    this.setData({
      order_info: order_info,
      consignee: order_info.consignee,
      telphone: order_info.tel_phone,
      address_id: order_info.user_address_id,
      address_detail: order_info.address_detail,
      goods_type:order_info.goods_type,
      needPayPrice:order_info.goods_total_fees
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


  

  // 选择地址
  selectAddressPressed: function() {
    wx.navigateTo({
      url: '/pages/userCenter/address/address?mark=1',
    })
  },

// 点击微信
  wxClick:function(){
    this.setData({
      wxCheck:true,
      xinHuiPointCheck:false,
      subsidyCheck:false
    })
  },

  xinHuiClick:function(){
    var userXinHuiPoint = this.data.order_info.user_xinhui_point
    var goodsTotalPoint = this.data.order_info.xinhui_point_total_price

    if (parseInt(userXinHuiPoint) > parseInt(goodsTotalPoint)){
      this.setData({
        wxCheck: false,
        xinHuiPointCheck: true,
        subsidyCheck: false
      })
    }else{
      wx.showToast({
        title: '昕惠分不足',
        icon: "none"
      })
    }

  },

  subsidyClick:function(){
    var userSubsidy = this.data.order_info.user_subsidy
    var goodsTotalSubsidy = this.data.order_info.subsidy_total_price

    if (parseInt(userSubsidy) > parseInt(goodsTotalSubsidy)) {
      this.setData({
        wxCheck: false,
        xinHuiPointCheck: false,
        subsidyCheck: true
      })
    }else{
      wx.showToast({
        title: '补贴金不足',
        icon:"none"
      })
    }
  },
  // 输入备注
  inputMemoPressed:function(event){
    this.setData({
      memo: event.detail.value
    })
  },

  // 提交
  sumitPressed:function(){
    if(this.data.goods_type == 0){
      var address_id = this.data.address_id
      if (address_id == 0) {
        wx.showToast({
          title: '请选择收货地址',
          icon: 'none'
        })
        return;
      }

    }
    

    var orderInfo = this.data.order_info

    var payType = 0
    if(this.data.wxCheck){
      payType = 1
    } else if (this.data.xinHuiPointCheck){
      payType = 2
    }else{
      payType = 3
    }

    wx.showLoading({
      title: '请稍等...',
    })

    var para = {}
    para["goods_id"] = encryptUtils.base64Encode(orderInfo.goods_id)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["buy_num"] = encryptUtils.base64Encode(orderInfo.buy_num)
    para["first_specification_value_id"] = encryptUtils.base64Encode(orderInfo.first_specification_value_id)
    para["second_specification_value_id"] = encryptUtils.base64Encode(orderInfo.second_specification_value_id)
    para["user_address_id"] = encryptUtils.base64Encode(this.data.goods_type == 0 ? address_id:0)
    para["memo"] = encryptUtils.base64Encode(this.data.memo)
    para["shop_logistics_id"] = encryptUtils.base64Encode(0)
    para["pay_type"] = encryptUtils.base64Encode(payType)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "addorder",
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
        wx.hideLoading()
        console.log(res)
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)
          if(result.need_price>0){
            wx.redirectTo({
              url: '/pages/pay/pay?need_price=' + result.need_price + "&order_no=" + result.order_no + "&order_id=" + result.order_id,
            })
          }else{
            wx.redirectTo({
              url: '/pages/index/goods/paySuccess/paySuccess?order_id=' + result.order_id + "&batch_order_sn=" + result.order_no,
            })
          }
          
          setTimeout(function(){
            wx.showToast({
              title: msg,
            })
          },400)
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      },
      complete: function () {

      }
    })
  },

})