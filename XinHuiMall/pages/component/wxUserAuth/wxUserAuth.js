const app = getApp()
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var wXBizDataCrypt = require('../../../utils/WXBizDataCrypt.js')

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    login_accept_content: imagePath + app.globalData.login_accept_content,
    isShowFlag: false,
    isShowLogin: true
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //隐藏弹框
    hideAuth: function() {
      this.setData({
        isShowFlag: !this.data.isShowFlag
      })
    },
    //展示弹框
    showAuth() {
      this.setData({
        isShowFlag: !this.data.isShowFlag
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _iKnow(e) {
      //触发我知道了回调
      var that = this
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl

          //需要弹出绑定手机号
          wx.setStorageSync("wx_nick_name", nickName)
          wx.setStorageSync("wx_avatar_url", avatarUrl)

          var encryptedData = e.detail.encryptedData;
          var iv = e.detail.iv;
          wx.login({
            success: function (res) {
              console.log("result==========wxLogin==" + JSON.stringify(res))
              if (res.code) {
                //发起网络请求
                console.log(res)
                if (wx.showLoading) {
                  wx.showLoading({
                    title: '正在登录',
                    mask: true
                  })
                }
                var para = {}
                para["js_code"] = res.code;
                para["v"] = encryptUtils.base64Encode(app.globalData.v);
                var str = JSON.stringify(para)
                var urlStr = encodeURIComponent(str)
                console.log("urlStr==" + urlStr)
                wx.request({
                  url: app.globalData.ip + "mini.system/useropenid",
                  method: 'POST',
                  header: {
                    'From': "WeChat",
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    'para': urlStr
                  },
                  success: function (res1) {
                    console.log("res=======" + JSON.stringify(res1))
                    var code = res1.statusCode
                    if (code == 200) {
                      var pc = new wXBizDataCrypt(app.globalData.appid, res1.data.session_key)
                      var data = pc.decryptData(encryptedData, iv)

                      var openId = res1.data.openid;
                      //OpenId获取成功，微信登录

                      var paraWX = {}
                      paraWX["wx_open_id"] = encryptUtils.base64Encode(openId);
                      paraWX["union_id"] = encryptUtils.base64Encode(data.unionId);
                      paraWX["v"] = encryptUtils.base64Encode(app.globalData.v);
                      var str = JSON.stringify(paraWX)
                      var urlStr = encodeURIComponent(str)
                      console.log("微信号登录 urlStr==" + urlStr)
                      wx.request({
                        url: app.globalData.ip + "isexistswx",
                        method: 'POST',
                        header: {
                          'From': "WeChat",
                          'content-type': 'application/x-www-form-urlencoded'
                        },
                        data: {
                          'para': urlStr
                        },
                        success: function (res) {
                          var code = res.data.code
                          console.log("res微信号登录 ==" + JSON.stringify(res))
                          if (code == 100) {
                            if (wx.hideLoading) {
                              wx.hideLoading()
                            }
                            var userInfo = modelUtils.getModel(res.data.result)
                            wx.setStorageSync("is_exists", userInfo.is_exists)

                            if (userInfo.is_exists == 1) {
                              wx.setStorageSync("head_img", userInfo.head_img)
                              wx.setStorageSync("nick_name", userInfo.nick_name)
                              wx.setStorageSync("user_id", userInfo.user_id)

                              var msg = res.data.msg
                              wx.showToast({
                                title: msg,
                                icon: "none"
                              })
                            }else{
                              wx.setStorageSync("union_id", data.unionId)
                              wx.setStorageSync("wx_open_id", openId)
                            }

                            //登录成功传递事件出去
                            that.triggerEvent("iKnow")

                          } else if (code == 101){
                            wx.setStorageSync("is_exists", 0)
                            wx.setStorageSync("union_id", data.unionId)
                            wx.setStorageSync("wx_open_id", openId)
                            //登录成功传递事件出去
                            that.triggerEvent("iKnow")
                          } else {
                            var msg = res.data.msg
                            wx.showToast({
                              title: msg,
                              icon: "none"
                            })
                          }
                        },
                        fail: function () {
                          wx.showToast({
                            title: '网络异常',
                            icon: "none"
                          })
                        },
                        complete: function () { }
                      })
                      





                    } else {
                      var message = res.errMsg
                      wx.showToast({
                        title: message,
                        icon: "none"
                      })
                    }
                  },
                  fail: function () {
                    wx.showToast({
                      title: '网络异常',
                      icon: "none"
                    })
                  },
                  complete: function () { }
                })
              } else {
                wx.showToast({
                  title: '登录失败',
                })
              }
            }
          });


        },
        fail: function() {
          wx.showToast({
            title: '登录失败',
          })
        }
      })
    },
  }
})