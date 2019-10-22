// pages/orderList/logisticsNumer/logisticsNumer.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.order_id){
      this.setData({
        orderId: options.order_id
      })
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
// 提交
  formSubmit(res) {
    console.log(res)
    var that = this
    if (!res.detail.value.company) {
      wx.showToast({
        title: '请输入快递公司名称',
        icon:'none'
      })
      return
    } else if (!res.detail.value.order_number) {
      wx.showToast({
        title: '请填写寄回单号',
        icon: 'none'
      })
      return
    } else{
      that.getPageData(res.detail.value.company, res.detail.value.order_number)
    }

  },
  getPageData: function (company,order) {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var that = this
    var para = { company, order}
    console.log(company, order)
    para["company_name"] = encryptUtils.base64Encode(company)
    para["logistics_number"] = encryptUtils.base64Encode(order)
    para["order_id"] = encryptUtils.base64Encode(that.data.order_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "addlogisticsnumber",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        wx.hideLoading()
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: msg,
          })
          setTimeout(function () {
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
      },
      fail: function (res) {
        wx.showToast({
          title: msg,
          icon: 'success',
        })
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
  },

})