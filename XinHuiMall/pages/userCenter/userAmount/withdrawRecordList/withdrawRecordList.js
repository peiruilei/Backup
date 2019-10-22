// pages/userCenter/userAmount/withdrawRecordList/withdrawRecordList.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var pageSize=10
var pageIndex=1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_withdraw_select: imagePath + app.globalData.content_withdraw_select,
    content_withdraw_success: imagePath + app.globalData.content_withdraw_success,
    content_withdraw_wait: imagePath + app.globalData.content_withdraw_wait,
    content_withdraw_no: imagePath + app.globalData.content_withdraw_no,
    common_no_data: imagePath + app.globalData.common_no_data,
    withdrawList:[],
    showNoData:false,
    loadMore:false,
    year: '',
    month: '',
    nav: 1,
    time: '',//获取时间
    timer:''
  },
  //选择日期
  bindDateChange(res) {
    console.log(res)
    var timer = res.detail.value;
    var dataStrArr = timer.split("-");
    console.log(dataStrArr)
    this.setData({
      year: dataStrArr[0],
      month: dataStrArr[1],
      timer:timer,
      showNoData:false,
       loadMore:false,
    })
  pageIndex=1

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
    // var dataIntArr = [];
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
 pageIndex=1
 this.setData({
   loadMore:false,
   showNoData:false
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
    para["withdraw_date"] = encryptUtils.base64Encode(that.data.timer)
    para["user_id"] = encryptUtils.base64Encode(user_id)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "withdrawrecordlist",
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
      // for(var i=0;i<result.length;i++){
      // //  var addTime=result[i].add_time
      // //  addTime=addTime.split("-")
      // //  addTime.splice(0,1)
      // //  result[i].add_time=addTime.join("-")
      //   result[i].add_time = utils.formatTimeElse(result[i]["add_time"])
        
      // }


          if (pageIndex == 1) {
            if (result.length) {
              that.setData({
                withdrawList: result,
                loadMore: result.length == pageSize,
                showNoData: false,
              })
                   

            } else {
              that.setData({
                showNoData: true,
                withdrawList: result,
                loadMore: result.length == pageSize,
              })
            }

          } else {
            var withdrawList = that.data.withdrawList
            withdrawList = withdrawList.concat(result)
            that.setData({
              withdrawList: withdrawList,
              loadMore: result.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              withdrawList: []
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