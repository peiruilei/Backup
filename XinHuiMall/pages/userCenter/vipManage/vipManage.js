// pages/userCenter/vipManage/vipManage.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var pageSize = 10
var pageIndex = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: [{
      'name': '您的好友',
     
    }, {
      'name': '您的伙伴',
    }],
    common_no_data: imagePath + app.globalData.common_no_data,
    content_vip_bg: imagePath + app.globalData.content_vip_bg,
    nav: 1,
    mark:1,
    showNoData:false,
    loadMore:false,
    vipInfo:{},
    rebateList:[]

  },
  // 好友
  pickFriends(res) {
    console.log(res)
    var mark = res.currentTarget.dataset.id
    var nav = res.currentTarget.dataset.id
    this.setData({
      nav: nav,
      mark:mark
    })
    pageIndex=1
    this.getPageData()
  },
  // 伙伴
  pickCompany(res) {
    pageIndex=1
    console.log(res)
    var mark = res.currentTarget.dataset.id
    var nav = res.currentTarget.dataset.id
    this.setData({
      nav: nav,
      mark: mark
    })
    this.getPageData()
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    pageIndex = 1
    this.setData({
      loadMore:false,
      showNoData:false
    })
  },

  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
this.getPageData()
  },

  

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    pageIndex = 1
    this.setData({
      loadMore: false,
      showNoData: false
    })
  },

  getPageData: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
     var user_id = wx.getStorageSync("user_id")
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["page"] = encryptUtils.base64Encode(pageIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["mark"] = encryptUtils.base64Encode(that.data.mark)//1：您的好友，2：您的伙伴
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "vipmanage",
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
          var result = modelUtils.getModel(res.data.result)

          console.log(result)
          if (pageIndex == 1) {
            if (result.rebate_list.length) {
              that.setData({
                vipInfo: result,
                rebateList: result.rebate_list,
                loadMore: result.rebate_list.length == pageSize,
                showNoData: false,
              })
            } else {
              that.setData({
                showNoData: true,
                vipInfo: result,
                rebateList: result.rebate_list,
                loadMore: result.rebate_list.length == pageSize,
              })
            }

          } else {
            var rebateList = that.data.rebate_list
            rebateList = rebateList.concat(result.rebate_list)
            that.setData({
              rebateList: rebateList,
              loadMore: result.rebate_list.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              rebateList: []
            })
          } else {
            that.setData({
              loadMore: false
            })
          }
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
  },


  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    pageIndex = 1;
    this.getPageData();
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var loadMore = this.data.loadMore
    if (loadMore) {
      pageIndex = pageIndex + 1
      this.getPageData()
    }
  },
})