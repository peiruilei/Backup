// pages/index/writeOff/scanCodeWriteOff/scanCodeWriteOff.js

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
    writeoff_scancode_bg: imagePath + app.globalData.writeoff_scancode_bg,
    writeoffArray:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  //获取页面信息
  getPageData: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["receiverecord_id"]=encryptUtils.base64Encode(3)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "redpackdetailqrcode",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        console.log('扫码核销页面数据', res)
        var code = res.data.code
        var msg = res.data.msg
        wx.hideLoading()
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)
          console.log(result)
          that.setData({
            writeoffArray:result
          })
        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
        // that.setData({
        //   showNoData: true,
        //   msg: '网络异常',
        // })
      },
      complete: function () { }
    })
  },

  // 确认核销
  save_confirm: function(){
   
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["receiverecord_id"] = encryptUtils.base64Encode(3)
    para["writeoffuser_id"] = encryptUtils.base64Encode(2)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip +'destroyredpack',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        console.log('确认核销',res)
        var code = res.data.code
        var msg = res.data.msg
        wx.hideLoading()
        if(code == 100){
          wx.showToast({
            title: msg,
            icon: 'success'
          })
        }else{
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () { }
    })
  }
})

