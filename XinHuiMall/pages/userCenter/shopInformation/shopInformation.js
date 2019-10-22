// pages/userCenter/shopInformation/shopInformation.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var pageIndex = 1;
var pageSize = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // shopSlect:[{
    //   'name':'上架中',
    //   'id':'0'
    // }, {
    //   'name': '已下架',
    //     'id': '1'}],
    common_no_data: imagePath + app.globalData.common_no_data,
    shopInformation: {},
    goods_list: [],
    loadMore: false,
    showNoData: false,
    nav:1,
   mark:1

  },
  // 上架
  upperClick(res){
    var nav = res.currentTarget.dataset.index
    var mark = res.currentTarget.dataset.index
      this.setData({
        nav: nav,
        mark: mark
      })
    this.getPageData()
     
  },
  // 下架
  lowerClick(res){
    var nav = res.currentTarget.dataset.index
    var mark = res.currentTarget.dataset.index
    console.log(res, nav)
    this.setData({
      nav: nav,
      mark:mark
    })
    this.getPageData()
  },
//  商品详情
  goodClick(res){
  wx.navigateTo({
    url: '/pages/index/goods/goodsDetail/goodsDetail?goods_id='+ this.data.goods_list.goods_id,
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
     pageIndex = 1
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getPageData()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    pageIndex = 1
    this.setData({
      loadMore: false,
      showNoData: false,
    })
  },

  getPageData: function(mark) {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    var user_id = wx.getStorageSync("user_id")
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["page"] = encryptUtils.base64Encode(pageIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["mark"] = encryptUtils.base64Encode(that.data.mark)
    para["user_id"] = encryptUtils.base64Encode(user_id)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "shopinformation",
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
          var result = modelUtils.getModel(res.data.result)
          console.log(result)
          if (pageIndex == 1) {
            if (result.goods_list.length) {
              that.setData({
                shopInformation: result,
                goods_list: result.goods_list,
                loadMore: result.goods_list.length == pageSize,
                showNoData: false,

              })
            } else {
              that.setData({
                showNoData: true,
                shopInformation: result,
                goods_list: result.goods_list,
                loadMore: result.goods_list.length == pageSize,
              })
            }

          } else {
            var goods_list = that.data.goods_list
            goods_list = goods_list.concat(result.goods_list)
            that.setData({
              goods_list: goods_list,
              loadMore: result.goods_list.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              goods_list: []
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
        wx.hideLoading()
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