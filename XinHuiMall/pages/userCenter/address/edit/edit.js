// pages/userCenter/address/edit/edit.js

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
    showNoData: false,
    district_id: 0,
    city_id: 0,
    province_id: 0,
    address_detail: "",
    addressSrc: "",
    tel_phone: "",
    consignee: "",
    is_default: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      address_id: options.address_id
    })
    this.getPageData()
  },

  //获取页面数据
  getPageData: function() {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        });
      }
    }
    var that = this;
    var para = {};
    para["user_address_id"] = encryptUtils.base64Encode(that.data.address_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "addressdetail",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function success(res) {
        console.log(res);
        wx.hideLoading()
        var code = res.data.code;
        var msg = res.data.msg;
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)
          that.setData({
            consignee: result.consignee,
            tel_phone: result.telphone,
            addressSrc: result.province_name + result.city_name + result.district_name,
            province_id: result.province_id,
            district_id: result.district_id,
            city_id: result.city_id,
            address_detail: result.address_detail,
            is_default: result.is_default == 1
          })
        } else {
          that.setData({
            showNoData: true,
            msg: msg
          })
          wx.showToast({
            title: msg,
            icon: 'none'
          });
        }
      },
      fail: function fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
        that.setData({
          showNoData: true,
          msg: '网络异常'
        })
      },
      complete: function complete() {

      }
    });
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
          title: '正在修改',
          mask: true
        })
      }
    }

    var para = {}

    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["useraddress_id"] = encryptUtils.base64Encode(this.data.address_id)
    para["consignee"] = encryptUtils.base64Encode(consignee)
    para["tel_phone"] = encryptUtils.base64Encode(telphone)
    para["address_detail"] = encryptUtils.base64Encode(address_detail)
    para["is_default"] = encryptUtils.base64Encode(this.data.is_default ? 1 : 0)
    para["province_id"] = encryptUtils.base64Encode(this.data.province_id)
    para["city_id"] = encryptUtils.base64Encode(this.data.city_id)
    para["district_id"] = encryptUtils.base64Encode(this.data.district_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    wx.request({
      url: app.globalData.ip + "editaddress",
      method: 'POSt',
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
        if (code == 100) {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
          })
          var pages = getCurrentPages()
          var listPage = pages[pages.length - 2]
          listPage.getPageData()
          wx.navigateBack(1)
          setTimeout(function(){
            wx.showToast({
              title: '修改成功',
            })
          },400)
        } else {
          wx.showToast({
            title: msg,
            icon: 'success',
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '网络异常',
          icon: 'success',
        })
      },
      complete: function() {
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