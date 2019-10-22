// pages/userCenter/setting/changePassword/changePassword.js
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
    verify_code: "获取验证码",
    get_code: "true",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     
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
    if (!timer) {
    } else {
      clearTimeout(timer)
    }
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
    var that = this
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id);
    para["oper_type"] = encryptUtils.base64Encode(1);
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
            icon: 'none'
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


  // 提交
  formSubmit: function (event) {

    var oldPwd = event.detail.value.oldPwd;
    var newPwd = event.detail.value.newPwd;
    var verifyCode = event.detail.value.verifyCode;
    console.log('旧密码',oldPwd)
    console.log('新密码', newPwd)
    console.log('验证码', verifyCode)

    if (oldPwd.length == 0) {
      wx.showToast({
        title: '请输入原密码',
        icon: 'none'
      })
      return
    }
    if (newPwd.length < 6) {
      wx.showToast({
        title: '密码最少六位数',
        icon: 'none'
      })
      return
    }
    if (verifyCode.length == 0) {
      wx.showToast({
        title: '请输入验证码',
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
    para["old_pwd"] = encryptUtils.base64Encode(oldPwd)
    para["new_pwd"] = encryptUtils.base64Encode(md5.hex_md5(md5.hex_md5(newPwd)))
    // para["new_pwd"] = encryptUtils.base64Encode(newPwd)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    console.log(str)
    var urlStr = encodeURIComponent(str)
    wx.request({
      url: app.globalData.ip + "editloginpwd",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr,
      },
      success: function (res) {
        var code = res.data.code
        var msg = res.data.msg
        console.log(code)
        console.log(msg)
        // var newPwd = event.detail.value.newPwd;
        /*wx.setStorage({
          key: "newPwd",
          data: newPwd,
          success:function(res){
            wx.showToast({
              title: '修改成功',
              icon: 'success',
            })
            timer = setTimeout(function () {
              wx.navigateBack({
                delta: 2
              })
            }, 1000)
          },
        })*/
        if (code == 100) {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
          })
          timer = setTimeout(function () {
            wx.navigateBack({
              delta: 2
            })
          }, 1000)
        } else if(code == 101){
          wx.showToast({
            title: '修改失败',
            icon: 'none',
          })
        }else if(code == 102){
          wx.showToast({
            title: '参数错误',
            icon: 'none',
          })
        }else if(code == 103){
          wx.showToast({
            title: '未绑定手机号',
            icon: 'none',
          })
        }else if(code == 104){
          wx.showToast({
            title: '验证码错误',
            icon:'none'
          })
        }else if(code == 105){
          wx.showToast({
            title: '验证码超时',
            icon:'none'
          })
        }else if(code == 106){
          wx.showToast({
            title: '原密码错误',
            icon:'none'
          })
        }else{
          wx.showToast({
            title: '网络连接异常',
            icon:'none'
          })
        }
        /*wx.showToast({
          title: '修改成功',
          icon: 'success',
        })
        timer = setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 1000)*/
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      },
      complete: function () {}
    })
  },
})