const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')

var timer
var countDown = 120

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bind_tel: "",
    bind_v_code: "",
    bind_pwd: "",
    bind_sure_pwd: "",
    v_code: "获取验证码",
    getCode: true,
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

  },
  //
  bind_tel: function (event) {
    this.setData({
      bind_tel: event.detail.value,
    })
  },
  //
  bind_v_code: function (event) {
    this.setData({
      bind_v_code: event.detail.value,
    })
  },
  //
  bind_pwd: function (event) {
    this.setData({
      bind_pwd: event.detail.value,
    })
  },
  //
  bind_sure_pwd: function (event) {
    this.setData({
      bind_sure_pwd: event.detail.value,
    })
  },
  //获取验证码
  getVerifiyCode: function (event) {
    var that = this;
    countDown = 120
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    var getCode = this.data.getCode
    if (!getCode) {
      return
    }
    if (that.data.bind_tel.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return
    }

    if (that.data.bind_tel.length < 11) {
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
    para["user_tel"] = encryptUtils.base64Encode(that.data.bind_tel);
    para["oper_type"] = encryptUtils.base64Encode("1");
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==============" + urlStr)
    var that = this
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
      success: function (res) {
        var code = res.data.code
        var message = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: message,
          })
          that.verifiyCodeCountDown()
        } else {
          wx.showToast({
            title: message,
            icon: 'clare',
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
          icon: 'clare',
        })
      }
    })
  },

  //验证码倒计时
  verifiyCodeCountDown: function () {
    var that = this
    //重置计数器初始值
    if (countDown == 0) {
      that.setData({
        v_code: "获取验证码",
        getCode: true
      })
      if (timer) {
        clearTimeout(timer)
      }
      countDown = 120;
      return;
    }
    timer = setTimeout(function () {
      that.setData({
        v_code: "" + countDown + "s",
        getCode: false
      })
      countDown--;
      that.verifiyCodeCountDown();
    }, 1000);

  },
  // 注册
  userRegisterWeChatTap: function () {
    var that = this;
    
    if (that.data.bind_pwd.length == 0) {
      wx.showToast({
        title: '请输入密码',
        icon: "none"
      })
      return
    }

    if (that.data.bind_pwd.length < 6) {
      wx.showToast({
        title: '请输入6～16位密码',
        icon: "none"
      })
      return
    }

    if (that.data.bind_sure_pwd.length == 0) {
      wx.showToast({
        title: '请输入确认密码',
        icon: "none"
      })
      return
    }

    if (that.data.bind_sure_pwd.length < 6) {
      wx.showToast({
        title: '请输入6～16位确认密码',
        icon: "none"
      })
      return
    }

    if (that.data.bind_pwd != that.data.bind_sure_pwd) {
      wx.showToast({
        title: '密码与确认密码不一致',
        icon: "none"
      })
      return
    }

    if (that.data.bind_tel.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return
    }

    if (that.data.bind_tel.length < 11) {
      wx.showToast({
        title: '请输入11位手机号',
        icon: "none"
      })
      return
    }

    if (that.data.bind_v_code.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: "none"
      })
      return
    }

    if (that.data.bind_v_code.length < 6) {
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
    para["puser_id"] = encryptUtils.base64Encode(0)
    para["login_name"] = encryptUtils.base64Encode(that.data.bind_tel)
    para["verify_code"] = encryptUtils.base64Encode(that.data.bind_v_code)
    para["login_pwd"] = encryptUtils.base64Encode(that.data.bind_pwd)
    para["device_type"] = encryptUtils.base64Encode(2)
    para["device_token"] = encryptUtils.base64Encode("")
    para["nick_name"] = encryptUtils.base64Encode(wx.getStorageSync("wx_nick_name"))
    para["head_img"] = encryptUtils.base64Encode(wx.getStorageSync("wx_avatar_url"))
    para["union_id"] = encryptUtils.base64Encode(wx.getStorageSync("union_id"))
    para["wx_open_id"] = encryptUtils.base64Encode(wx.getStorageSync("wx_open_id"))
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "wxregist",
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
          var result = modelUtils.getModel(res.data.result)

          wx.setStorageSync("user_id", result.user_id)
          wx.setStorageSync("head_img", result.head_img)
          wx.setStorageSync("nick_name", result.nick_name)

          wx.showToast({
            title: msg,
          })
          wx.navigateBack({
            delta: 2
          })
        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
          that.setData({
            msg: msg,
            showNoData: true
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: "none"
        })
        that.setData({
          msg: "网络异常",
          showNoData: true
        })
      },
      complete: function () { }
    })
  },
  
})