// pages/userCenter/userAmount/pointChangeList/pointChangeList.js
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
    content_subsidy_bg: imagePath + app.globalData.content_subsidy_bg,
    content_withdraw_select: imagePath + app.globalData.content_withdraw_select,
    content_subsidy_payTime_bg: imagePath + app.globalData.content_subsidy_payTime_bg,
    common_no_data: imagePath + app.globalData.common_no_data,
    year: '',
    month: '',
    nav: 1,
    time: '',//获取时间
    timer:'',
    mark: 1,
    showNoData: false,
    loadMore: false,
    point:{},
    pointChangeList:[]
  },
// 日期
  bindDateChange(res) {
    console.log(res)
    var timer = res.detail.value;
    var dataStrArr = timer.split("-");
    // var dataIntArr = [];
    console.log(dataStrArr)
    this.setData({
      year: dataStrArr[0],
      month: dataStrArr[1],
      timer: timer,
    })
    this.getPageData()
  },

// 积分收入
  receiveClick(res){
    pageIndex=1
    this.getPageData({
      showNoData:false,
      loadMore:false
    })
    var mark = res.currentTarget.dataset.index
    this.setData({
      nav: res.currentTarget.dataset.index,
      mark: mark
    })
    this.getPageData()
  },
  // 积分支出
  pushClick(res){
    pageIndex = 1
    this.getPageData({
      showNoData: false,
      loadMore: false
    })
    var mark = res.currentTarget.dataset.index
    this.setData({
      nav: res.currentTarget.dataset.index,
      mark: mark
    })
    this.getPageData()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageIndex = 1
    var TIME = utils.formatTimeDay(new Date());
    console.log(TIME)
    var date = TIME.split("-");
    console.log(date)
    this.setData({
      year: date[0],
      month: date[1],
      time: TIME,
      timer:TIME,
      showNoData: false,
      loadMore: false
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
    para["xinhui_point_change_date"] = encryptUtils.base64Encode(that.data.timer)//日期
    para["mark"] = encryptUtils.base64Encode(that.data.mark)//1:昕惠分收入，2：昕惠分支出

    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "xinhuipointchangelist",
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
            if (result.xinhui_point_change_list.length) {
              that.setData({
                point: result.user_xinhui_point,
                pointChangeList: result.xinhui_point_change_list,
                loadMore: result.xinhui_point_change_list.length == pageSize,
                showNoData: false,

              })
            } else {
              that.setData({
                showNoData: true,
                point: result.user_xinhui_point,
                pointChangeList: result.xinhui_point_change_list,
                loadMore: result.xinhui_point_change_list.length == pageSize,
              })
            }

          } else {
            var pointChangeList = that.data.pointChangeList
            pointChangeList = pointChangeList.concat(result.xinhui_point_change_list)
            that.setData({
              pointChangeList: pointChangeList,
              loadMore: result.xinhui_point_change_list.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              pointChangeList: []
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