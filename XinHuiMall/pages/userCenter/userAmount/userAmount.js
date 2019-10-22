// pages/userCenter/userAmount/userAmount.js
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
    content_icon: imagePath + app.globalData.content_icon,
    content_withdrawRecordList: imagePath + app.globalData.content_withdrawrecordlist,
    content_bg: imagePath + app.globalData.content_bg,
    content_accountDetail: imagePath + app.globalData.content_accountdetail,
    moneyInfo:{}
  },
  // 冻结
  freezeClick(res){
    var that=this
    wx.navigateTo({
      url: '/pages/userCenter/userAmount/freezeState/freezeState?freezeState=' + that.data.moneyInfo.freeze_amount_explain,
    })
  },
  // 申请提现
  feesClick(res){
var that=this
    if (that.data.moneyInfo.is_set_pwd>0) {
        wx.navigateTo({
          url: '/pages/userCenter/userAmount/applyWithdrawal/applyWithdrawal?user_tel='+that.data.moneyInfo.login_name
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您还未设置提现密码',
        confirmText: '去设置',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/userCenter/userInfo/setPwd/setPwd?user_tel=' + that.data.moneyInfo.login_name,
            })
          }
        }
      })
    }
  },
  // 提现记录
  withdrawClick(res){
    wx.navigateTo({
      url: '/pages/userCenter/userAmount/withdrawRecordList/withdrawRecordList',
    })
  },
  // 收支明细
  accountClick(res){
    wx.navigateTo({
      url: '/pages/userCenter/userAmount/accountDetail/accountDetail',
    })
  },
  // 补贴金明细
  subsidyClick(res){
    wx.navigateTo({
      url: '/pages/userCenter/userAmount/subsidyChangeList/subsidyChangeList',
    })
  },
   // 积分明细
  pointClick(res){
    wx.navigateTo({
      url: '/pages/userCenter/userAmount/pointChangeList/pointChangeList',
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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
    console.log(app.globalData.ip + "useramount")
    wx.request({
      url: app.globalData.ip + "useramount",
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
          wx.hideLoading()
          var needData = res.data.result
          var moneyInfo = modelUtils.getModel(needData)
          console.log(moneyInfo)
          that.setData({
            moneyInfo: moneyInfo
          })
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
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
  

  
})