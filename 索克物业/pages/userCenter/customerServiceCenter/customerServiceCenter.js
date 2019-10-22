// pages/userCenter/customerServiceCenter/customerServiceCenter.js

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
    usercenter_online_customer_service: imagePath + app.globalData.usercenter_online_customer_service,
    usercenter_contact_tel: imagePath + app.globalData.usercenter_contact_tel,
    // contact_tel: "",
    cantactArrayTel: [],
    isShowBg:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getPageData();
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 打电话
  callCustomerServiePressed: function() {
    var cantactArrayTel = this.data.cantactArrayTel
    if (cantactArrayTel.length==1){
      wx.makePhoneCall({
        phoneNumber: cantactArrayTel[0].explain_content
      })
    }else{
      this.setData({
        isShowBg:true,
      })
    }
    // wx.makePhoneCall({
    //   phoneNumber: this.data.contact_tel,
    // })
  },
  // 隐藏虚着呢电话
  hideShowBgPressed:function() {
    this.setData({
      isShowBg: false,
    })
  },
  
  noHideShowBgPressed:function(){

  },

  callPhonePressed:function(event)
  {
    var tel = event.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel,
    })
    this.setData({
      isShowBg: false,
    })
  },


  //获取页面信息
  getPageData: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "user/explainsettinginfo",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        wx.hideLoading()
        if (code == 100) {
          var result = modelUtils.getList(res.data.result)
          
          that.setData({
            cantactArrayTel: result,
          })

        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
        }
      },
      fail: function() {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function() {}
    })
  },
})