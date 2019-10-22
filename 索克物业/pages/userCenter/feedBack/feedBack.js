// pages/userCenter/feedBack/feedBack.js
var app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')


var noNeedAdd = true
var delImgIDStr = ""
var completeCount = 0 //图片上传成功数量

Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: imagePath + app.globalData.common_select,
    no_select: imagePath + app.globalData.common_unselect,
    upload_img: imagePath + app.globalData.common_upload_img,
    FeedbackImgList: [],
    feedBackTypeList: [{
      "typeStr": "功能异常",
      "typeExplain": "不能正常使用现有功能",
      "is_click": "1"
    }, {
      "typeStr": "使用建议",
      "typeExplain": "",
      "is_click": "0"
    }, {
      "typeStr": "功能需求",
      "typeExplain": "现有功能不能满足",
      "is_click": "0"
    }, {
      "typeStr": "系统闪退",
      "typeExplain": "APP意外退出，闪退",
      "is_click": "0"
    }],
    feedBackType: 1,
    feedback_img_str: ""
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

  //选择
  selectType: function (event) {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    var that = this
    var index = event.currentTarget.dataset.index
    var feedBackTypeList = that.data.feedBackTypeList
    var feedBackType = 0
    for (var i = 0; i < feedBackTypeList.length; i++) {
      if (i == index) {
        feedBackTypeList[i].is_click = 1
        feedBackType = index + 1
      } else {
        feedBackTypeList[i].is_click = 0
      }
    }
    that.setData({
      feedBackTypeList: feedBackTypeList,
      feedBackType: feedBackType
    })

  },
  // 选择图片
  getImg: function (event) {
    var that = this
    var state = event.currentTarget.dataset.state //1:原有图片的删除或查看大图  2：添加图片
    var FeedbackImgList = that.data.FeedbackImgList //图片列表
    if (state == 1) {
      var index = event.currentTarget.dataset.index
      wx.showActionSheet({
        itemList: ["大图预览", "删除"],
        success: function (res) {
          var position = res.tapIndex
          if (position == 0) {
            var urls = []
            var current = FeedbackImgList[index].img
            for (var i = 0; i < FeedbackImgList.length; i++) {
              urls[i] = FeedbackImgList[i].img
            }
            wx.previewImage({
              current: current, // 当前显示图片的http链接
              urls: urls // 需要预览的图片http链接列表
            })
          } else if (position == 1) {
            FeedbackImgList.splice(parseInt(index), 1)
            that.setData({
              FeedbackImgList: FeedbackImgList
            })
          }
        }
      })
    } else {
      wx.chooseImage({
        count: 9 - FeedbackImgList.length, //选择图片个数 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          var tempFilePaths = res.tempFilePaths
          for (var i = 0; i < tempFilePaths.length; i++) {
            var item = {}
            item["img"] = tempFilePaths[i]
            FeedbackImgList.splice(0, 0, item)
          }
          that.setData({
            FeedbackImgList: FeedbackImgList
          })
        }
      })
    }

  },

  //form表单提交
  formSubmit: function (event) {
    var that = this
    var feedBackContent = event.detail.value.feedBackContent
    var telPhone = event.detail.value.telPhone
    var feedBackType = that.data.feedBackType

    if (feedBackType == 0) {
      wx.showToast({
        title: '请选择功能类型',
        icon: 'none'
      })
      return
    }
    if (feedBackContent.length == 0) {
      wx.showToast({
        title: '请输入反馈的问题',
        icon: 'none'
      })
      return
    }
    var FeedbackImgList = that.data.FeedbackImgList
    if (FeedbackImgList.length > 0) {
      that.uploadDIY(FeedbackImgList, 0, 0, 0, FeedbackImgList.length, feedBackContent, telPhone, feedBackType)
    } else {
      that.editFeedbackInfo(feedBackContent, telPhone, feedBackType)
    }

  },

  //提交意见反馈信息
  editFeedbackInfo: function (feedBackContent, telPhone, feedBackType) {
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在提交...',
        mask: true,
      })
    }
    var that = this
    var para = {}
    var userID = wx.getStorageSync("user_id");
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    para["user_id"] = encryptUtils.base64Encode(userID);
    para["feed_back_content"] = encryptUtils.base64Encode(feedBackContent);
    para["feed_back_type"] = encryptUtils.base64Encode(feedBackType);
    para["tel_phone"] = encryptUtils.base64Encode(telPhone);
    para["feed_backimg_str"] = encryptUtils.base64Encode(that.data.feedback_img_str);

    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.request({
      url: app.globalData.ip + "mini.system/addfeedbackinfo",
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
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showToast({
            title: message,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'none',

        })

      },
      complete: function () { }
    })
  },
  uploadDIY(FeedbackImgList, successUp, failUp, i, length, feedBackContent, telPhone, feedBackType) {
    var that = this
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在提交...',
        mask: true
      })
    }
    var para = {}
    para["source_type"] = encryptUtils.base64Encode(1);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.uploadFile({
      url: app.globalData.ip + "order/useruploadimg",
      filePath: FeedbackImgList[i].img,
      name: 'fileData',
      formData: {
        'para': urlStr
      },
      header: {
        'From': "WeChat",
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        successUp++;
        var resValue = JSON.parse(res.data)
        var code = resValue.code
        var result = modelUtils.getModel(resValue.result)


        if (code == 100) {
          // 财力图片拼接--->缩略图,大图,原图|缩略图,大图,原图|缩略图,大图,原图【同一图片以 , 拼接，不同图片以|拼接】
          var feedbackImgStr = that.data.feedback_img_str
          if (feedbackImgStr.length == 0) {
            feedbackImgStr = result.thumb_img + ',' + result.big_img + ',' + result.source_img
          } else {
            feedbackImgStr = feedbackImgStr + '^' + result.thumb_img + ',' + result.big_img + ',' + result.source_img
          }
          that.setData({
            feedback_img_str: feedbackImgStr
          })

        } else {

        }
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        completeCount++;
        var imgCount = FeedbackImgList.length
        if (completeCount == imgCount) {
          that.editFeedbackInfo(feedBackContent, telPhone, feedBackType)
        } else {
          if (i == length) { } else { //递归调用uploadDIY函数
            this.uploadDIY(FeedbackImgList, successUp, failUp, i, length, feedBackContent, telPhone, feedBackType);
          }
        }
      },
    });
  },
})