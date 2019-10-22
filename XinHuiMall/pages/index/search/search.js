// pages/index/search/search.js
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
    common_dele: imagePath + app.globalData.common_dele,
    home_search: imagePath + app.globalData.home_search,
    searchRecord: [],
    keyWords: "",
    mark:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.mark){
      this.setData({
        mark:options.mark
      })
    }
    this.openHistorySearch()
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

  // 点击所搜历史
  selectHistoricalPressed: function (event) {
    var keysWords = event.currentTarget.dataset.keyword;
    var mark = this.data.mark
    // wx.navigateTo({
    //   url: '/pages/index/search/searchResult/searchResult?kerWorks=' + keysWords,
    // })

    if (mark == 0) {
      wx.navigateTo({
        url: '/pages/index/search/searchResult/searchResult?kerWorks=' + keysWords,
      })
    } else {
      var pages = getCurrentPages()
      var lastPages = pages[pages.length - 2]
      lastPages.setData({
        kerWorks: keysWords
      })
      lastPages.getPageData();

      wx.navigateBack({
        delta: 1
      })

    }

  },
  // 输入内容
  inputPressed: function (event) {
    this.setData({
      keyWords: event.detail.value
    })
  },

  // 点击搜索
  searchGoodsPressed: function () {
    var that = this
    var keywords = this.data.keyWords
    var searchRecord = this.data.searchRecord
    var mark = this.data.mark
    if (keywords == '') {
      //输入为空时的处理
      wx.showToast({
        title: '请输入要搜索的商品',
        icon: "none"
      })
    } else {
      //将搜索值放入历史记录中,只能放前五条
      searchRecord.unshift({
        value: keywords,
        id: searchRecord.length
      })
      //将历史记录数组整体储存到缓存中
      wx.setStorageSync('searchRecord', searchRecord)

      that.setData({
        searchRecord: searchRecord,
      })

      if(mark == 0){
        wx.navigateTo({
          url: '/pages/index/search/searchResult/searchResult?kerWorks=' + keywords,
        })
      }else{
        var pages = getCurrentPages()
        var lastPages = pages[pages.length - 2]
        lastPages.setData({
          kerWorks: keywords
        })
        lastPages.getPageData();

        wx.navigateBack({
          delta:1
        })

      }

    }

  },

  openHistorySearch: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [], //若无储存则为空
    })
  },
  
  inputPressed: function (e) {
    this.setData({
      keyWords: e.detail.value
    })
  },

  cancelPressed:function(){
    wx.navigateBack({
      delta:1
    })
  },
  //清空记录
  clearHistoricalPressed:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要清空搜索记录吗',
      success:function(res){
        if(res.confirm){
          wx.setStorageSync("searchRecord", [])
          that.setData({
            searchRecord:[]
          })
        }
      }
    })
  },

})