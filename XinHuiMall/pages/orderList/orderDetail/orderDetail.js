const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var http = require('../../userCenter/shoppingCart/http.js')
Page({
  data: {
    shopDetail_assess_light: imagePath + app.globalData.shopDetail_assess_light,
    shopDetail_assess: imagePath + app.globalData.shopDetail_assess,
    shopDetail_phone: imagePath + app.globalData.shopDetail_phone,
    order_detail_copy: imagePath + app.globalData.order_detail_copy,
    content_back: imagePath + app.globalData.content_back,
    shopping_cart_icon: imagePath + app.globalData.shopping_cart_icon,
    QR_icon: imagePath + app.globalData.QR_icon,
    order_info:{},
  },
  onLoad: function (options) {
    if (options.order_id){
      this.setData({
        order_id: options.order_id
      })
    }
    if (options.order_state == 2){
      wx.setNavigationBarTitle({
        title: '待发货订单',
      })
    } else if (options.order_state == 3){
      wx.setNavigationBarTitle({
        title: '待收货订单',
      })
    }else{
      wx.setNavigationBarTitle({
        title: '订单详情',
      })
    }
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
  //商家详情
  onShopDetails(e){
    console.log(e.currentTarget.dataset.shop_id)
    wx.navigateTo({
      url: '/pages/index/goods/businessDetails/businessDetails?shop_id='+e.currentTarget.dataset.shop_id,
    })
  },
  //商品详情
  onGoodsDetails(e) {
    console.log(e.currentTarget.dataset.goods_id)
    wx.navigateTo({
      url: '/pages/index/goods/goodsDetail/goodsDetail?goods_id=' + e.currentTarget.dataset.goods_id,
    })
  },
  // 选择地址
  // selectAddressPressed: function () {
  //   wx.navigateTo({
  //     url: '/pages/userCenter/address/address?mark=1',
  //   })
  // },
  //订单底部功能
  onOrderFun(e){
    var that = this
    var order_state = e.currentTarget.dataset.order_state
    console.log(order_state)
    switch (parseInt(order_state)) {
      case 1:
      //删除订单
        wx.showModal({
          title: '提示',
          content: '您确定要删除订单吗',
          success: function (res) {
            if (res.confirm) {
              that.getEditOrder(1)
            }
          }
        })
        
        break;
      case 2:
        //取消订单
        wx.showModal({
          title: '提示',
          content: '您确定要取消待支付订单吗',
          success: function (res) {
            if (res.confirm) {
              that.getEditOrder(2)
            }
          }
        })
        
        break;
      case 3:
      //确认收货
        that.getEditOrder(3)
        break;
      case 4:
       //申请退款
       wx.navigateTo({
         url: '/pages/orderList/returnPrice/returnPrice?order_id=' + that.data.order_id + '&mark=0',
       })
        break;
      case 5:
        //售后
        wx.navigateTo({
          url: '/pages/orderList/returnPrice/returnPrice?order_id=' + that.data.order_id+'&mark=1',
        })
        break;
      case 6:
        //评价
        wx.navigateTo({
          url: '/pages/index/goods/goodsAssess/goodsAssess?order_id=' + that.data.order_id,
        })
        break;
      case 8:
        //支付
        wx.navigateTo({
          url: '/pages/pay/pay?need_price=' + e.currentTarget.dataset.order_total_fees + '&order_no=' + e.currentTarget.dataset.order_sn +'&order_id=' + that.data.order_id,
        })
        break;
      case 9:
        
        break;
      default:
        break;
    }
  },
  //出示二维码
  onShowQR(e){
    var is_use = e.currentTarget.dataset.is_use
    var qr_image = e.currentTarget.dataset.qr_image
    wx.setStorageSync('qr_image', qr_image)
    wx.navigateTo({
      // url: '/pages/orderList/orderDetail/showQR/showQR?is_use=' + is_use + '&qr_image=' + qr_image,
      url: '/pages/orderList/orderDetail/showQR/showQR?is_use=' + is_use,
    })
  },
  //打电话
  onCall(){
    wx.makePhoneCall({
      phoneNumber: this.data.order_info.order_info.phone_num
    })
  },
  // 复制快递单号
  onCopyingRight(e){
    wx.setClipboardData({
      data: e.currentTarget.dataset.logistics_number,
    })
  },
  // 获取页面数据
  getPageData: function (latitude, longitude) {
    var that = this
    var data = {
      v: app.globalData.v,
      order_id: that.data.order_id,
      user_lng: longitude,
      user_lat: latitude
    }
    console.log(data)
    http.postReq('orderdetail', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        var order_info = modelUtils.getModel(res.result)
        var ordersumPrice = parseFloat(order_info.order_info.order_total_fees) + parseFloat(order_info.order_info.logistics_fees)
        var service_score = Math.round(order_info.order_info.service_score)
        var tel_new = order_info.order_info.tel_phone
        tel_new = tel_new.split('')
        tel_new.splice(3, 5, 'xxxxx')
        order_info.order_info.tel_phone = tel_new.join('')
        order_info.order_info.ordersumPrice = parseFloat(ordersumPrice)
        order_info.order_info.service_score = service_score
       console.log(order_info)
          that.setData({
            order_info: order_info,
            consignee: order_info.order_info.consignee,
            telphone:tel_new.join(''),
            address_detail: order_info.order_info.address_detail
          })
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },
  // 订单操作
  getEditOrder(mark_type){
    var that = this
    var data = {
      v: app.globalData.v,
      order_id: that.data.order_id,
      user_id: wx.getStorageSync('user_id'),
      mark_type: mark_type
    }
    console.log(data)
    http.postReq('editorder', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        wx.showToast({
          title: msg,
          icon: 'success',
          duration:2000
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
  }
})