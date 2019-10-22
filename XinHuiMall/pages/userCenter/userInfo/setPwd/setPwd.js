// pages/userCenter/userInfo/setPwd/setPwd.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var md5 = require('../../../../utils/md5.js')
var countDown = 120;
var timer;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_tel:'',
    verify_code: "获取验证码",
    get_code: "true",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
this.setData({
  user_tel:options.user_tel
})
if(options.is_set_pwd==0){
wx.setNavigationBarTitle({
  title: '设置提现密码',
})
}else{
  wx.setNavigationBarTitle({
    title: '修改提现密码',
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

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (!timer) {
    } else {
      clearTimeout(timer)
    }
  },
  // 获取验证码
  getVerifiyCode: function (event) {
    var getCode = this.data.get_code
    if (!getCode) {
      return
    }
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在获取',
        mask: true,
      })
    }
    var para = {}
    var that=this
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id);
    para["oper_type"] = encryptUtils.base64Encode(22);
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    console.log(str)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "mini.system/getverifycodebyuserid",
      method: 'POST',
      header:
      {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data:
      {
        'para': urlStr
      },
      success: function (res) {
        var code = res.data.code
        if (code == 100) {
          wx.showToast({
            title: '验证码已发送',
            icon:'none'
          })
          that.verifiyCodeCountDown()
        } else if (code == 101) {
          wx.showToast({
            title: '获取验证码失败',
            icon: 'none',
          })
        } else if (code == 102) {
          wx.showToast({
            title: '参数错误',
            icon: 'none',
          })
        } else {
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      }
    })
  },
  //验证码倒计时
  verifiyCodeCountDown: function () {
    var that = this
    //重置计数器初始值
    if (countDown == 0) {
      that.setData(
        {
          verify_code: "获取验证码",
          get_code: true
        }
      )
      if (timer) {
        clearTimeout(timer)
      }
      countDown = 120;
      return;
    }
    timer = setTimeout(function () {
      that.setData(
        {
          verify_code: "重新发送" + countDown + "s",
          get_code: false
        }
      )
      countDown--;
      that.verifiyCodeCountDown();
    }, 1000);

  },
  formSubmit: function (event) {
    var verifyCode = event.detail.value.verifyCode;
    var loginPwd=event.detail.value.loginPwd
    var withdrawPwd = event.detail.value.withdrawPwd;
    var againWithdrawPwd = event.detail.value.againWithdrawPwd;
    if (verifyCode.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
        
      })
      return
    }
    if (loginPwd.length == 0) {
      wx.showToast({
        title: '请输入登录密码',
        icon: 'none'
      })
      return
    }
    if (loginPwd.length < 6) {
      wx.showToast({
        title: '请输入6～16位密码',
        icon: "none"
      })
      return
    }
    if (withdrawPwd.length < 6) {
      wx.showToast({
        title: '密码最少6位',
        icon: 'none'
      })
      return
    }
    if (againWithdrawPwd.length == 0) {
      wx.showToast({
        title: '请再次输入密码',
        icon: 'none'
      })
      return
    }
    if (againWithdrawPwd != withdrawPwd) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return
    }
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var para = {}
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["verify_code"] = encryptUtils.base64Encode(verifyCode)
    para["login_pwd"] = encryptUtils.base64Encode(loginPwd)
    para["withdraw_pwd"] = encryptUtils.base64Encode(md5.hex_md5(md5.hex_md5(withdrawPwd)))
    para["reply_withdraw_pwd"] = encryptUtils.base64Encode(md5.hex_md5(md5.hex_md5(againWithdrawPwd)))
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    console.log(str)
    var urlStr = encodeURIComponent(str)
    wx.request({
      url: app.globalData.ip + "editwithdrawpwd",
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
        var code = res.data.code
        var msg = res.data.msg
        console.log(code)
        console.log(msg)
        if (code == 100) {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
          setTimeout(function () {
              wx.navigateBack()

            }, 1000)

        //   if (mark == 1) {//没有设置过支付密码
        //     var pages = getCurrentPages()
        //     var prevPage = pages[pages.length - 2]
        //     prevPage.setData({
        //       is_set_pay_pwd: 1
        //     })
        //     setTimeout(function () {
        //       wx.navigateBack()
           
        //     }, 1000)
        //   }
        //   else {
        //     setTimeout(function () {
        //       wx.navigateBack()
        //     }, 1000)
        //   }
        // } else {
        //   wx.showToast({
        //     title: msg,
        //     icon: 'success',
        //   })
       }else{
          wx.hideLoading()
         wx.showToast({
           title: msg,
           icon:'none'
         })
       }
      },
      fail: function (res) {
        wx.hideLoading()
        console.log("网络异常")
        wx.showToast({
          title: '网络异常',
          icon: 'success',
        })
      }
      ,
      complete: function () {


      }
    }
    )
  },
})