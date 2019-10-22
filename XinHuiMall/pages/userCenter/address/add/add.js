// pages/userCenter/address/add/add.js
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
    common_select: imagePath + app.globalData.common_select,
    common_un_select: imagePath + app.globalData.common_un_select,
    district_id: 0,
    city_id: 0,
    province_id: 0,
    address_detail: "",
    addressSrc: "",
    tel_phone: "",
    consignee: "",
    is_default: true,
    address_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  

  //保存地址
  submitAddress: function(e) {
    var consignee = this.data.consignee
    if (consignee.length == 0) {
      wx.showToast({
        title: '请输入姓名',
        icon: "none"
      })
      return
    }
    var telphone = this.data.tel_phone
    if (telphone.length == 0) {
      wx.showToast({
        title: '请输入联系电话',
        icon: "none"
      })
      return
    }
    if (telphone.length != 11) {
      wx.showToast({
        title: '请输入11位的手机号',
        icon: "none"
      })
      return
    }
    var province_id = this.data.province_id
    if (province_id == 0) {
      wx.showToast({
        title: '请输选择所在地区',
        icon: "none"
      })
      return
    }

    var address_detail = this.data.address_detail
    if (address_detail.length == 0) {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none"
      })
      return
    }

    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在添加',
          mask: true
        })
      }
    }

    var para = {}

    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["consignee"] = encryptUtils.base64Encode(consignee)
    para["tel_phone"] = encryptUtils.base64Encode(telphone)
    para["address_detail"] = encryptUtils.base64Encode(address_detail)
    para["is_default"] = encryptUtils.base64Encode(this.data.is_default?1:0)
    para["province_id"] = encryptUtils.base64Encode(this.data.province_id)
    para["city_id"] = encryptUtils.base64Encode(this.data.city_id)
    para["district_id"] = encryptUtils.base64Encode(this.data.district_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    wx.request({
      url: app.globalData.ip + "addaddress",
      method: 'POSt',
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
          wx.showToast({
            title: '添加成功',
            icon: 'success',
          })
          var pages = getCurrentPages()
          var listPage = pages[pages.length - 2]
          listPage.getPageData()
          wx.navigateBack(1)
        } else {
          wx.showToast({
            title: msg,
            icon: 'success',
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'success',
        })
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
    
  },


  // 是否设置默认
  selectDefaultPressed: function() {
    var is_default = this.data.is_default
    this.setData({
      is_default: !is_default,
    })
  },
  // 输入姓名
  inputConsigneePressed: function(event) {
    this.setData({
      consignee: event.detail.value
    })
  },

  inputTelPressed: function(event) {
    this.setData({
      tel_phone: event.detail.value
    })
  },

  inputAddressDetailPressed: function(event) {
    this.setData({
      address_detail: event.detail.value
    })
  },

  selectAddressPressed: function() {
    wx.navigateTo({
      url: '/pages/userCenter/address/selectCity/selectCity',
    })
  },


})