const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var currentIndex =0
var pageConfirm = [] //保存每一加载信息
var pageSize = 15
var loading = false
var pageIndex = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_use: imagePath + app.globalData.common_no_data,
    table: [
      { 'name': "全部", 'mark': "0", 'isSelect': true },
      { 'name': "待接单", 'mark': "1", 'isSelect': false },
      { 'name': "待验收", 'mark': "2", 'isSelect': false },
      { 'name': "待评价", 'mark': "4", 'isSelect': false },
      { 'name': "已完成", 'mark': "5", 'isSelect': false },
      { 'name': "已取消", 'mark': "6", 'isSelect': false }
    ],
    orderList:[],//订单列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    currentIndex=0;
    pageIndex = 1;
    pageConfirm = []
    var table = this.data.table
    for (var i = 0; i < table.length; i++) {
      table[i].isSelect = false
      var pageConfirmItem = {}
      pageConfirmItem["page"] = 1
      pageConfirmItem["pageCount"] = 0
      pageConfirmItem["mark"] = table[i].mark
      pageConfirmItem["list"] = []
      pageConfirmItem["isGet"] = false
      pageConfirm = pageConfirm.concat(pageConfirmItem)
    }
    table[currentIndex].isSelect = true
    this.setData({
      table: table,
    })
    
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
  //订单详情
  orderDetailClick:function(event)
  {
    var orderID=event.currentTarget.id;
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?order_id=' + orderID,
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var pageComnfimItem = pageConfirm[currentIndex]
    pageComnfimItem["page"] = 1
    this.getPageData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMoreData()
  },
  //table间的切换
  tableItemClick: function (event) {
    var index = event.currentTarget.id
    currentIndex = index
    var table = this.data.table
    for (var i = 0; i < table.length; i++) {
      if (i == index) {
        table[i]["isSelect"] = true
      } else {
        table[i]["isSelect"] = false
      }
    }
    var pageComnfimItem = pageConfirm[currentIndex]
    var list = pageComnfimItem.list
    var isGet = pageComnfimItem.isGet
    if (list.length == 0 && !isGet) {
      this.setData({
        table: table
      })

    } else {
      var pageCount = pageComnfimItem["pageCount"]
      this.setData({
        list: list,
        table: table,
        showNoData: list.length <= 0,
        loadMore: pageCount == pageSize
      })
    }
    this.getPageData()

  },
  /**
 * 用户点击右上角分享
 */
  //获取页面数据
  getPageData: function () {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var para = {}
    var userID = wx.getStorageSync('user_id')
    para["page"] = encryptUtils.base64Encode(pageConfirm[currentIndex].page + "")
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["user_id"] = encryptUtils.base64Encode(userID)
    para["order_state"] = encryptUtils.base64Encode(pageConfirm[currentIndex].mark + "") //订单状态（0：全部，1：待接单 2：待验收（进行中）4：待评价 5：已完成 6：已取消）
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    var that = this
    wx.request({
      url: app.globalData.ip + "order/userorderlist",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        var code = res.data.code
        var msg = res.data.msg
        console.log(res);
        var pageConfirmItem = pageConfirm[currentIndex];   
        pageIndex = pageConfirmItem["page"];
        if (code == 100) {  
             
          var result = modelUtils.getList(res.data.result);
          var loadMore = result.length == pageSize;
          pageConfirmItem["pageCount"] = result.length;

          var orderList = result;
          if (pageIndex == 1) {
            pageConfirmItem["isGet"] = true
            pageConfirmItem["list"] = orderList
            that.setData({
              orderList: orderList,
              loadMore: loadMore,
              showNoData: false
            })
          } else {
            var list = pageConfirmItem.list
            list = list.concat(orderList)
            that.setData({
              orderList: list,
              loadMore: loadMore,
              showNoData: false
            })
          }
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
          if (pageIndex == 1) {
            pageConfirmItem["isGet"] = true
            pageConfirmItem["pageCount"] = 0
            pageConfirmItem["list"] = []
            that.setData({
              orderList: [],
              showNoData: true,
              loadMore: false
            })
          } else {
            that.setData({
              loadMore: false
            })
          }
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      },
      complete: function () {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })
  },
  //加载更多
  getMoreData: function () {
    var loadMore = this.data.loadMore
    if (loadMore && !loading) {
      var pageComnfimItem = pageConfirm[currentIndex]
      var pageIndex = pageComnfimItem["page"]
      pageIndex += 1
      pageComnfimItem["page"] = pageIndex
      this.getPageData()
    }
  }
})