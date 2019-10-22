// pages/userCenter/userAmount/accountDetail/accountDetail.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var pageSize = 10
var pageIndex = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_account_partner: imagePath + app.globalData.content_account_partner,
    content_account_goods: imagePath + app.globalData.content_account_goods,
    content_account_friend: imagePath + app.globalData.content_account_friend,
    common_no_data: imagePath + app.globalData.common_no_data,
    content_withdraw_select: imagePath + app.globalData.content_withdraw_select,
    year:'',
    month:'',
    time:'',//获取当前日期
    timer:'',//选择时间
    showNoData: false,
    loadMore: false,
    accountList:[],
    userId:'',

  },

  // 日期的选择
  // bindDateChange(res) {
  //   console.log(res)
  //   var timer = res.detail.value;
  //   var dataStrArr = timer.split("-");
  //   console.log(timer)
  //   this.setData({
  //     year: dataStrArr[0],
  //     month: dataStrArr[1],
  //     timer: timer,
  //   })
  //   this.getPageData()
  // },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = wx.getStorageSync("user_id")//1：好友订单0：【如果source_user_id不等于user_id则是伙伴订单，否则是商品销售】
    pageIndex = 1
    var TIME = utils.formatTimeDay(new Date());
    console.log(TIME, userId)
    var date = TIME.split("-");
    this.setData({
      year: date[0],
      month: date[1],
      time: TIME,
      timer:TIME,
      userId:userId,
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
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["page"] = encryptUtils.base64Encode(pageIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "accountdetail",
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
               
                accountList: result,
                loadMore: result.length == pageSize,
                showNoData: false,

              })

              
            } else {
              that.setData({
                showNoData: true,
              
                accountList: result,
                loadMore: result.length == pageSize,
              })
            }

          } else {
            var accountList = that.data.accountList
            accountList = accountList.concat(result)
            that.setData({
              accountList: accountList,
              loadMore: result.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              accountList: []
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