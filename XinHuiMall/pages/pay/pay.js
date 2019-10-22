// pages/pay/pay.js
import {
  $wuxKeyBoard
} from '../../dist/index'

const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../utils/HHEncryptUtils.js')
var modelUtils = require('../../utils/HHModelUtils.js')
var utils = require('../../utils/util.js')
var md5 = require('../../utils/md5.js')

var openId = ""
var total = 0
var mark = 1 //下单

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopping_cart_noselect: imagePath + app.globalData.shopping_cart_noselect,
    shopping_cart_select: imagePath + app.globalData.shopping_cart_select,
    pay_balance: imagePath + app.globalData.pay_balance,
    pay_wx: imagePath + app.globalData.pay_wx,
    userFees:0,
    chaCheck:false,
    wxCheck:true,
    order_no:"",
    getPayPwd: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.need_price){
      this.setData({
        total:parseFloat(options.need_price)
      })
    }

    if (options.order_no){
      this.setData({
        order_no: options.order_no
      })
    }

    if (options.order_id){
      this.setData({
        order_id: options.order_id
      })
    }

    this.getPageData()
    this.wxLogin(false)
  },



  //获取用户余额
  getPageData: function () {
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在加载',
      })
    }
    var para = {}
    var userID = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(userID);
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("para==" + urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "userfees",
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
        console.log("result==" + JSON.stringify(res.data.result))
        if (code == 100) {
          var userInfo = modelUtils.getModel(res.data.result)
          console.log("result  userInfo==" + JSON.stringify(userInfo))
          var userFees = parseFloat(userInfo.user_fees) //用户余额
          var isSetPwd = parseFloat(userInfo.is_set_pwd) //是否设置密码

          var total = that.data.total
          if (total > userFees) {
            chaCheck = false
            wxCheck = true
          } else {
            if (isSetPwd == 1) {
              var chaCheck = true
              var wxCheck = false
            } else {
              var chaCheck = false
              var wxCheck = true
            }
          }
          that.setData({
            isSetPwd: isSetPwd,
            userFees: userFees,
            chaCheck: chaCheck,
            wxCheck: wxCheck
          })

        } else {
          var message = res.data.msg
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
        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })
  },
  //余额支付
  chaClick: function () {
    var userFees = this.data.userFees
    var total = this.data.total
    var chaCheck = this.data.chaCheck
    var wxCheck = this.data.wxCheck
    var isSetPwd = this.data.isSetPwd
    if (total > userFees) //余额不足
    {
      wx.showToast({
        title: '余额不足',
        icon: 'none'
      })
    } else {
      if (isSetPwd == 0) {
        //未设置支付密码，引导用户去设置支付密码
        wx.showModal({
          title: '未设置支付密码',
          content: '您确定要设置支付密码吗？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000',
          confirmText: '确定',
          confirmColor: '#109d57',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: '/pages/usercenter/editPayPwd/edit',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        })
        chaCheck = false
      } else {
        chaCheck = true
        wxCheck = false
      }

    }
    this.setData({
      chaCheck: chaCheck,
      wxCheck: wxCheck
    })
  },
  //微信支付
  wxClick: function () {
    this.setData({
      chaCheck: false,
      wxCheck: true
    })
  },
  //确认支付
  pay: function (value, pay_type) {
    console.log("支付")
    var pay_pwd = value //余额时为空
    var that = this
    var chaCheck = this.data.chaCheck

    if (wx.showLoading) {
      wx.showLoading({
        title: '正在支付',
      })
    }
    var para = {}
    console.log(openId)
    para["order_sn"] = encryptUtils.base64Encode(that.data.order_no);
    para["pay_type"] = encryptUtils.base64Encode(pay_type); //1、余额支付，2：支付宝支付，3：微信支付
    para["pay_pwd"] = encryptUtils.base64Encode(md5.hex_md5(md5.hex_md5(pay_pwd)));
    console.log("mark==" + mark)
    para["pay_mark"] = encryptUtils.base64Encode(1); //1：订单支付 2：物品清单支付
    para["open_id"] = encryptUtils.base64Encode(openId);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "hybridpaycashier",
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
        var result = modelUtils.getModel(res.data.result)
        console.log("支付result==" + JSON.stringify(res.data))
        if (code == 100) {
          var pageList = getCurrentPages()
          if (wx.hideLoading) {
            wx.hideLoading()
          }
          if (pay_type == 1) { //1：余额支付  2：微信支付
            // wx.navigateBack({ //返回
            //   delta: 1
            // })
            wx.redirectTo({
              url: '/pages/index/goods/paySuccess/paySuccess?order_id=' + that.data.order_id + "&batch_order_sn=" + that.data.order_no,
            })
            
            setTimeout(function () {
              wx.showToast({
                title: '支付成功',
                icon: 'success'
              })
            }, 300)
          } else if (pay_type == 3) {
            var payInfo = res.data.result
            wx.requestPayment({
              'timeStamp': payInfo.timeStamp,
              'nonceStr': payInfo.nonceStr,
              'package': payInfo.package,
              'signType': "MD5",
              'paySign': payInfo.paySign,
              success: function (res) {
                console.log(res)

                wx.redirectTo({
                  url: '/pages/index/goods/paySuccess/paySuccess?order_id=' + that.data.order_id + "&batch_order_sn=" + that.data.order_no,
                })
                
                setTimeout(function () {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'success'
                  })
                }, 300)
              },
              fail: function (res) {
                wx.showToast({
                  title: "您取消了支付",
                })
                console.log("fail==" + JSON.stringify(res))
              }
            })
          }

        } else {
          var message = res.data.msg
          wx.showToast({
            title: message,
            icon: "none"
          })
        }

      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
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
        title: '正在登录',
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
            title: '登录失败',
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
          openId = res.data.openid;
          if (needPay) {
            console.log("message=11111111=")
            that.pay("", 3)
          }
        } else {
          var message = res.errMsg
          console.log("message==" + message)
          wx.showToast({
            title: message,
          })
        }

        console.log("res.data.openId==" + res.data.openid) //获取openid 
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () {
        wx.hideLoading()
      }

    })
  },
  openWithPromiseCallback() {
    var that = this
    const http = (obj) => {
      return new Promise((resolve, reject) => {
        obj.success = (res) => resolve(res)
        obj.fail = (res) => reject(res)
        wx.request(obj)
      })
    }

    $wuxKeyBoard().show({
      callback(value) {
        console.log(`输入的密码是：${value}`)

        wx.showLoading({
          title: '验证支付密码'
        })
        that.pay(value, 1)
        // return http({
        //         url: 'https://www.skyvow.cn/api/user/sign/in',
        //         method: 'POST',
        //         data: {
        //             username: 'admin',
        //             password: value
        //         }
        //     })
        //     .then(res => {
        //         const data = res.data

        //         console.log(data)

        //         wx.hideLoading()

        //         wx.showToast({
        //             title: data.meta.message,
        //             duration: 3000,
        //         })

        //         if (data.meta.code !== 0) {
        //             return Promise.reject(data.meta.message)
        //         }
        //     })
      },
    })
    
  },
  formSubmit: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要支付吗？',
      success:function(res){
        if(res.confirm){
          var wxCheck = that.data.wxCheck
          var chaCheck = that.data.chaCheck
          console.log("wxCheck==" + wxCheck)
          console.log("chaCheck==" + chaCheck)

          if (!wxCheck && !chaCheck) {
            wx.showToast({
              title: '请选择支付方式',
              icon: 'none'
            })
            return
          }
          if (chaCheck) {
            that.openWithPromiseCallback()
          }
          if (wxCheck) {
            console.log(1111)
            console.log("openId==" + openId)
            if (openId == '') {
              that.wxLogin(true)
              wx.showToast({
                title: '支付失败，请再次尝试支付',
                icon: 'none'
              })
              return
            }
            that.pay('', 3)
          }
        }
      }
    })
  }

})