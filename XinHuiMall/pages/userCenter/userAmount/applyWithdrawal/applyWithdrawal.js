const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var http = require('../../shoppingCart/http.js')
var md5 = require('../../../../utils/md5.js')
Page({
  data: {
    wechat_icon: imagePath + app.globalData.wechat_icon,
    content_back: imagePath + app.globalData.content_back,
    delete_popup: imagePath + app.globalData.delete_popup,
    delete_pop: imagePath + app.globalData.delete_pop,
    drawalInfo: {},
    withdraw_rate: 0,
    showPwdBg:false,
    passWord:[]
  },
  onLoad: function(options) {
console.log(options)
this.setData({
  user_tel: options.user_tel
})
  },
  onShow: function() {
    this.getPageData()
  },
  // 输入提现金额时
  inputMoney(res) {
    var that = this
    var str = res.detail.value
    if (str.length == 1) {
      if (str == ".") {
        str = "0."
      }
    } else if (/^(\d?)+(\.\d{0,2})?$/.test(res.detail.value)) { //正则验证，提现金额小数点后不能大于两位数字
      str = res.detail.value;
    } else {
      str = res.detail.value.substring(0, res.detail.value.length - 1);
    }
    if (str > parseFloat(that.data.drawalInfo.user_fees)) {
      str = that.data.drawalInfo.user_fees
    }

    var withdraw_rate = (parseFloat(str) * parseFloat(that.data.drawalInfo.withdraw_rate)).toFixed(2)
    this.setData({
      inputMoney: str,
      withdraw_rate: withdraw_rate
    })
  },
  //申请提现
  onFeedSubmit() {
    var that = this
    if (that.data.drawalInfo.user_fees == 0) {
      wx.showToast({
        title: '可提现金额为0元',
        icon: "none",
      })
      return
    }
    if (!that.data.inputMoney) {
      wx.showToast({
        title: '请输入提现金额',
        icon: "none"
      })
      return
    }
    if (that.data.inputMoney == 0) {
      wx.showToast({
        title: '输入的金额为0元',
        icon: 'none'
      })
      return
    }
    that.setData({
      showPwdBg:true
    })
  },
  //忘记密码
  forgetPwdBtn: function () {
    wx.navigateTo({
      url: '/pages/userCenter/userInfo/setPwd/setPwd?user_tel=' + this.data.user_tel,
    })
  },
  //  密码输入框
  inputValue(e) {
    let value = e.detail.value;
    let arr = [...value];
    this.setData({
      passWord: arr
    })
    if (arr.length == 6) {
      var psw = ""
      for (var i = 0; i < arr.length; i++) {
        psw = psw + arr[i]
      }
      this.wxLogin(psw)
      this.setData({
        showPwdBg: false,
        passWord: []

      })
    }
  },
  // 隐藏输入密码的页面
  hideShowViewPressed: function () {
    wx.showModal({
      title: '提示',
      content: '您确定要取消提现吗',
      success: function (res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })},
  getPageData() {
    var that = this
    var data = {
      v: app.globalData.v,
      user_id: wx.getStorageSync("user_id")
    }
    http.postReq('applywithdrawpage', data, function(res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        var drawalInfo = modelUtils.getModel(res.result)
        console.log(drawalInfo)
        that.setData({
          drawalInfo: drawalInfo
        })
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  },
  getSubmit(needPay, openId) {
    console.log(needPay, openId, wx.getStorageSync("user_id"))
    var that = this
    var data = {
      v: app.globalData.v,
      user_id: wx.getStorageSync("user_id"),
      we_chat_open_id: openId,
      type:2,
      withdraw_pwd: md5.hex_md5(md5.hex_md5(needPay)),
      withdraw_amount:that.data.inputMoney
    }
    http.postReq('applywithdraw', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        wx.showToast({
          title: msg,
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
  },
  /**
   * 微信登录 (授权登录)
   */
  wxLogin: function (needPay) {
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在处理',
        mask: true
      })
    }
    var that = this
    wx.login({
      success: function (res) {
        console.log("result1111111==" + JSON.stringify(res))
        if (res.code) {
          that.getOpenId(needPay, res.code)
        } else {
          wx.showToast({
            title: '失败',
          })
        }
      }
    });
  },

  /**
   * 根据 js_code 换取 openId
   */
  getOpenId: function (needPay, js_code) {
    var para = {}
    para["js_code"] = js_code;
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("获取openid  urlStr==" + urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "mini.system/useropenid",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        var code = res.statusCode
        console.log("res22222222==" + JSON.stringify(res))
        if (code == 200) {
          var openId = res.data.openid;
          that.getSubmit(needPay, openId)
        } else {
          var message = res.errMsg
          wx.showToast({
            title: message,
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () {
      }
    })
  },
})