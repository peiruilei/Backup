// pages/userCenter/userInfo/userInfo.js
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
      content_back: imagePath + app.globalData.content_back,
      userInfo:{}
  },
// 更改头像
  changeImg(res){
    var that=this


    // wx.showActionSheet({
    //   itemList: ['从相册选择','拍照'],
    //   success(res){
        wx.chooseImage({
          count:1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success(res) {
            console.log(res)
            // tempFilePath可以作为img标签的src属性显示图片
            const tempFilePaths = res.tempFilePaths
            that.uploadDIY(tempFilePaths)
          }
        })
    //   }
    // })

  },
  uploadDIY(tempFilePaths) {
    console.log(tempFilePaths)
    var that = this
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在上传...',
        mask: true
      })
    }
    var para = {}
    para["source_type"] = encryptUtils.base64Encode(2);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.uploadFile({
      url: app.globalData.ip + "useruploadimg",
      filePath: tempFilePaths[0],
      name: 'fileData',
      formData: {
        'para': urlStr
      },
      header: {
        'From': "WeChat",
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        var resValue = JSON.parse(res.data)
        var code = resValue.code
        var result = modelUtils.getModel(resValue.result)
        console.log(result, 898989)
        if (code == 100) {
          //  var  feedbackImgStr = result.thumb_img + ',' + result.big_img + ',' + result.source_img
          // console.log('11111111',feedbackImgStr)
          that.getReviseHeadimg(result.thumb_img)
        } else {

        }
      },
      fail: (res) => { },
      complete: () => { },
    });
  },
  // 头像修改
  getReviseHeadimg: function (head_img) {
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
    para["content"] = encryptUtils.base64Encode(head_img)
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["mark"] = encryptUtils.base64Encode(1)//1修改头像 
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
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
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
      
          that.getPageData()
          setTimeout(function () {
            wx.showToast({
              title: msg,
            })
          }, 1000)
      
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
  
  
  // 更改名字
  changeName(res) {
wx.navigateTo({
  url: '/pages/userCenter/userInfo/changeName/changeName?nick_name='+this.data.userInfo.nick_name,
})
  },
  // 更改手机号
  changeTel(res) {
    wx.navigateTo({
      url: '/pages/userCenter/userInfo/changeTel/changeTel?user_tel='+ this.data.userInfo.login_name
    })
  },
  // 设置密码
  setpwd(res) {
    wx.navigateTo({
      url: '/pages/userCenter/userInfo/setPwd/setPwd?user_tel=' + this.data.userInfo.login_name + '&is_set_pwd=' + this.data.userInfo.is_set_pwd,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
this.getPageData()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  getPageData: function () {
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
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    console.log(app.globalData.ip + "userdetail")
    wx.request({
      url: app.globalData.ip + "userdetail",
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
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          var needData = res.data.result
          var userInfo = modelUtils.getModel(needData)
          console.log(userInfo)
          that.setData({
            userInfo: userInfo
          })
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
        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })
  },


  
})