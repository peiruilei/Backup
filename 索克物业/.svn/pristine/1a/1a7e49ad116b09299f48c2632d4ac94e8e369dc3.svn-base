// pages/userCenter/publicNumber/publicNumber.js

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
    usercenter_public_bg: imagePath + app.globalData.usercenter_public_bg,
    showNoData: true,
    qrCodeStr: "",
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
      url: app.globalData.ip + "user/focusonthepublic",
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
          var result = modelUtils.getModel(res.data.result)
          that.setData({
            qrCodeStr: result.explain_content,
            showNoData:false,
          })
        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
          that.setData({
            showNoData: true,
            msg:msg
          })
        }
      },
      fail: function() {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
        that.setData({
          showNoData: true,
          msg: '网络异常',
        })
      },
      complete: function() {}
    })
  },


  savePicture: function () {
    wx.showLoading({
      title: '请稍等...',
    })
    var imgUrl = this.data.qrCodeStr;
    wx.downloadFile({
      url: imgUrl,
      success: function (res) {
        console.log(res)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.hideLoading();
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            wx.hideLoading()
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，再次点击按钮保存图片。')
                  } else {
                    console.log('获取权限失败')
                  }
                }
              })
            }
          },
          complete(res) {
            wx.hideLoading()
            console.log(res);
          }
        })
      },
    })
  },


})