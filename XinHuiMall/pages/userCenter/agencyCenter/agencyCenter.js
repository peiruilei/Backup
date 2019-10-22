// pages/userCenter/agencycenter/agencycenter.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var pageIndex=1
var pageSize=10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    common_no_data: imagePath + app.globalData.common_no_data,
   agencyList:[]
  },

  shopClick(res){
    console.log(res)
    var shop_id = res.currentTarget.dataset.shop_id
    wx.navigateTo({
      url:'/pages/userCenter/agencyCenter/commissionList/commissionList?shop_id=' + shop_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
pageIndex=1
this.setData({
  showNoData:false,
  loadMore:false
})
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
    pageIndex = 1
    this.setData({
      showNoData: false,
      loadMore: false
    })
  },
  getPageData: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    var user_id=wx.getStorageSync("user_id")
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["page"] = encryptUtils.base64Encode(pageIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["user_id"] = encryptUtils.base64Encode(user_id)
    

    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "agencycenter",
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
          var result = modelUtils.getList(res.data.result)
          console.log(result)
          if (pageIndex == 1) {
            if (result.length) {
              that.setData({
                agencyList: result,
                loadMore: result.length == pageSize,
                showNoData: false,
              })
            } else {
              that.setData({
                showNoData: true,
                agencyList: result,
                loadMore: result.length == pageSize,
              })
            }

          } else {
            var agencyList = that.data.agencyList
            agencyList = agencyList.concat(result)
            that.setData({
              agencyList: agencyList,
              loadMore: result.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              agencyList: []
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