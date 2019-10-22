// pages/userCenter/userInfo/changeTel/changeTel.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var timer
var countDown = 120;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    v_code: '获取验证码',
    userTel: '',
    getCode: 'true',
    codeNumber: '',
    tel_phone: ''
  },
  inputVerifyCodePressed(res) {


    console.log(res)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.setData({
      userTel: options.user_tel
    })
    console.log(this.data.userTel)
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },



  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    if (!timer) {} else {
      clearTimeout(timer)
    }

  },
  numberClick(res) {
    console.log(res)
    this.setData({
      tel_phone: res.detail.value
    })
  },
// 获取验证码
  getVerifyCode(event) {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    var getCode = this.data.getCode
    if (!getCode) {
      return
    }
    var that = this
    var tel_phone = that.data.tel_phone
    if (tel_phone==that.data.user_tel){
      wx.showToast({
        title: '请输入新的手机号',
        icon:'none'
      })
      return
    }
    if (tel_phone==0) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none'
      })
      return
    }
    if (tel_phone.length < 11) {
      wx.showToast({
        title: '请输入11位手机号',
        icon: "none"
      })
      return
    }
    
   
     
      if (wx.showLoading) {
        wx.showLoading({
          title: '正在获取',
          mask: true,
        })
      }
      var para = {}
      var that = this
      // var userId = wx.getStorageSync("user_id")
      para["user_tel"] = encryptUtils.base64Encode(tel_phone);
      para["oper_type"] = encryptUtils.base64Encode(4);
      para["v"] = encryptUtils.base64Encode(app.globalData.v)
      var str = JSON.stringify(para)
      console.log(str)
      var urlStr = encodeURIComponent(str)
      console.log(urlStr)

      wx.request({
        url: app.globalData.ip + "mini.system/getverifycodebyusertel",
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'From': "WeChat"
        },
        data: {
          'para': urlStr
        },
        success: function(res) {
          var msg = res.data.msg
          var code = res.data.code
         
          if (code == 100) {
            wx.showToast({
              title: '验证码已发送',
            })
            that.verifiyCodeCountDown()
          } else{
            wx.showToast({
              title: msg,
              icon: 'none',
            })
          }
        },
        fail: function() {
          wx.showToast({
            title: '网络异常',
            icon: 'clare',
          })
        }
      })
  },
  //验证码倒计时
  verifiyCodeCountDown: function() {
    var that = this
    //重置计数器初始值
    if (countDown == 0) {
      that.setData({
        v_code: "获取验证码",
        getCode: true
      })
      // 清除上一次的定时器
      if (timer) {
        clearTimeout(timer)
      }
      countDown = 120;
      return;
    }
    timer = setTimeout(function() {
      that.setData({
        v_code: "重新发送" + countDown + "s",
        getCode: false
      })
      countDown--;
      that.verifiyCodeCountDown();
    }, 1000);

  },
  // 提交
  formSubmit(res) {
    var verifyCode = res.detail.value.verifyCode;
    var tel_phone = res.detail.value.tel_phone;
    var that = this;

    if (verifyCode.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
      return
    }

    if (verifyCode.length.length < 6) {
      wx.showToast({
        title: '请输入6位验证码',
        icon: "none"
      })
      return
    }

    wx.showLoading({
      title: '正在加载...',
    })
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["verify_code"] = encryptUtils.base64Encode(verifyCode)
    para["new_telphone"] = encryptUtils.base64Encode(tel_phone)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))

    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "editloginname",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        console.log(res)
        wx.hideLoading()
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
            icon: "none"
          })
  
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: msg,
          icon: "none"
        })
      },
      complete: function () { }
    })
  },
    
  
})