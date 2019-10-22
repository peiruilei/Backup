// pages/userCenter/userInfo/changeName/changeName.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var nick_name
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nick_name:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   this.setData({
     nick_name:options.nick_name
   })
  },

  
  changeName(res){
    console.log(res)
    var nick_name=res.detail.value
    this.setData({
      nick_name:nick_name
    })

  },
  // 提交
  getmodification(res){
    var that=this
    if(that.data.nick_name){
      that.getPageData(that.data.nick_name)
    }else{
      wx.showToast({
        title: '请输入您的昵称',
        icon:'none'
      })
    }

  },
  getPageData: function (nick_name) {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var that = this
    var para = {}
   var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["content"] = encryptUtils.base64Encode(nick_name)
    para["mark"] = encryptUtils.base64Encode(2)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    console.log(app.globalData.ip + "edituserinfo")
    wx.request({
      url: app.globalData.ip + "edituserinfo",
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
     
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  
})