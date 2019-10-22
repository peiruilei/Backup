const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var pageIndex = 1
var pageSize = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    free_markdown: imagePath + app.globalData.free_markdown,
    no_use: imagePath + app.globalData.common_no_data,
    showNoData: false,
    loadMore: false,
    freeList: [],
    tab_list: [{
      tab_name: '进行中',
      isSelect: true,
      tab_id: 1
    },
    {
      tab_name: '已结束',
      isSelect: false,
      tab_id: 2
    }
    ],
    mark:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    pageIndex = 1
    this.getPageData()
  },
  // 顶部tab切换
  onbarSelect(e) {
    var tab_id = e.currentTarget.dataset.tab_id
    var index = e.currentTarget.dataset.index
    var tab_list = this.data.tab_list
    if (!tab_list[index].isSelect) {
      for (var i = 0; i < tab_list.length; i++) {
        if (i == index) {
          tab_list[i].isSelect = true
        } else {
          tab_list[i].isSelect = false
        }
      }
      this.setData({
        tab_list: tab_list,
        mark: tab_id
      })
      pageIndex = 1;
      this.getPageData();
    }

  },
  //活动详情
  onEventDetail(e){
    if(this.data.mark==1){
      wx.navigateTo({
        url: '/pages/userCenter/freeEvent/eventDetail/eventDetail?activity_id=' + e.currentTarget.dataset.activity_id,
      })
    }
   
  },
  getPageData: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["page"] = encryptUtils.base64Encode(pageIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["mark"] = encryptUtils.base64Encode(that.data.mark)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "activitylist",
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
        if (code == 100) {
          wx.hideLoading()
          var result = modelUtils.getList(res.data.result)
          console.log(111111111, result)
          if (pageIndex == 1) {
            that.setData({
              freeList: result,
              loadMore: result.length == pageSize,
              showNoData: false,
            })
          } else {
            var freeList = that.data.freeList
            freeList = freeList.concat(result)
            that.setData({
              freeList: freeList,
              loadMore: result.length == pageSize
            })
          }
        } else {
          wx.hideLoading()
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              freeList: []
            })
          } else {
            that.setData({
              loadMore: false
            })
          }
        }

      },
      fail: function() {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function() {

      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    pageIndex = 1;
    this.getPageData();
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var loadMore = this.data.loadMore
    if (loadMore) {
      pageIndex = pageIndex + 1
      this.getPageData()
    }
  },
})