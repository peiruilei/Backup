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
    task_type_select: imagePath + app.globalData.task_type_select,
    isFree:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPageData();
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
    this.getPageData();
    wx.stopPullDownRefresh();
  },
// 改变收费免费
  changeType: function () {
    var isFree = this.data.isFree;
    this.setData({
      isFree: !isFree
    })
  },
  selectType:function(event){
    var taskTypeID = event.currentTarget.id
    var taskTypeName = event.currentTarget.dataset.name
    var taskPrice = event.currentTarget.dataset.price;
    var pages = getCurrentPages()
    var lastPages = pages[pages.length - 2]
    lastPages.setData({
      taskTypeID: taskTypeID,
      taskTypeName: taskTypeName,
      taskPrice: taskPrice
    })
    lastPages.changeTaskTypeOrVillage();
    wx.navigateBack({
      delta: 1,
    })
  },
  //获取页面数据
  getPageData: function (type) {
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
      url: app.globalData.ip + "user/tasktypelist",
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
          var result = modelUtils.getModel(res.data.result)
          that.setData({
            mainData: result
          })
        } else {
          that.setData({
            msg: msg
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  }

})