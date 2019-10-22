const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../utils/HHEncryptUtils.js')
var modelUtils = require('../../utils/HHModelUtils.js')
var utils = require('../../utils/util.js')
var http = require('../userCenter/shoppingCart/http.js')
var pageIndex = 1
var pageSize = 20
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_use: imagePath + app.globalData.common_no_data,
    shopping_cart_icon: imagePath + app.globalData.shopping_cart_icon,
    order_detail_copy: imagePath + app.globalData.order_detail_copy,
    order_list: [{
        order_id: 0,
        order_name: '全部',
        isSelect: true
      },
      {
        order_id: 1,
        order_name: '待支付',
        isSelect: false
      },
      {
        order_id: 2,
        order_name: '待发货',
        isSelect: false
      },
      {
        order_id: 3,
        order_name: '待收货',
        isSelect: false
      },
      {
        order_id: 4,
        order_name: '待使用',
        isSelect: false
      },
      {
        order_id: 5,
        order_name: '待评价',
        isSelect: false
      },
      {
        order_id: 6,
        order_name: '售后',
        isSelect: false
      }
    ],
    order_fun_list:[
      {
        fun_name:'确认收货',
        fun_states:3,
        fun_id:1
      },
      {
        fun_name: '立即评价',
        fun_states: 4,
        fun_id: 2
      },
      {
        fun_name: '删除订单',
        fun_states: 5,
        fun_id: 3
      },
      {
        fun_name: '删除订单',
        fun_states: 6,
        fun_id: 3
      },
      {
        fun_name: '删除订单',
        fun_states: 11,
        fun_id: 3
      },
      {
        fun_name: '删除订单',
        fun_states: 12,
        fun_id: 3
      },
      {
        fun_name: '填写物流单号',
        fun_states: 9,
        fun_id: 4
      },
      // {
      //   fun_name: '支付',
      //   fun_states: 1,
      //   fun_id: 5
      // },
      // {
      //   fun_name: '取消订单',
      //   fun_states: 1,
      //   fun_id: 6
      // },
      {
        fun_name: '申请退款',
        fun_states: 2,
        fun_id: 7
      },
      {
        fun_name: '申请售后',
        fun_states: 4,
        fun_id: 8
      },
    ],
    payMode_list: ['', '零钱', '昕慧分', '补贴金'],
    mark: 0,
    showNoData: false,
    loadMore: false,
    orderList: [],
    isUser:false
  },
  onLoad: function(options) {
    
  },
  onShow: function() {
    var that = this
    var user_id = wx.getStorageSync("user_id")
    if (user_id) {
      that.setData({
        isUser: true,
        mark:0
      })
      pageIndex = 1;
      this.getPageData();
    }
  },
  //登录
  onLogin(){
    wx.navigateTo({
      url: '/pages/login/login/userLogin',
    })
  },
  //选择订单类型
  onSelectOrder(e) {
    this.setData({
      mark: e.currentTarget.dataset.order_id
    })
    pageIndex = 1;
    this.getPageData();
  },
  //订单详情
  onseeOrderDetail(e) {
    wx.navigateTo({
      url: '/pages/orderList/orderDetail/orderDetail?order_id=' + e.currentTarget.dataset.order_id + '&order_state=' + e.currentTarget.dataset.order_state,
    })
  },
  //订单功能
  onOrderFun(e) {
    var that = this
    var order_state = e.currentTarget.dataset.order_state
    var order_id = e.currentTarget.dataset.order_id
    var fun_id = e.currentTarget.dataset.fun_id
    console.log(fun_id)
    switch (parseInt(fun_id)) {
      case 1:
        //确认收货
        that.getEditOrder(order_id, 3)
        break;
      case 2:
        //评价
        wx.navigateTo({
          url: '/pages/index/goods/goodsAssess/goodsAssess?order_id=' + order_id,
        })
        break;
      case 3:
        //删除订单
        wx.showModal({
          title: '提示',
          content: '您确定要删除订单吗',
          success: function(res) {
            if (res.confirm) {
              that.getEditOrder(order_id, 1)
            }
          }
        })
        break;
      case 4:
        //填写物流单号
        wx.navigateTo({
          url: '/pages/orderList/logisticsNumer/logisticsNumer?order_id=' + order_id,
        })
        break;
      // case 5:
      //   // 支付
      //   wx.navigateTo({
      //     url: '/pages/pay/pay?need_price='++'&order_no='++'&order_id',
      //   })
      //   break;
      // case 6:
      //   // 取消订单
      //   wx.showModal({
      //     title: '提示',
      //     content: '您确定要取消订单吗',
      //     success: function (res) {
      //       if (res.confirm) {
      //         that.getEditOrder(order_id, 2)
      //       }
      //     }
      //   })
      //   break;
      case 7:
        //申请退款
        wx.navigateTo({
          url: '/pages/orderList/returnPrice/returnPrice?order_id=' + order_id + '&mark=0',
        })
        break;
      case 8:
        //售后
        wx.navigateTo({
          url: '/pages/orderList/returnPrice/returnPrice?order_id=' + order_id + '&mark=1',
        })
        break;
      default:
        break;
    }
  },
  //防止联系商家点击进入商品详情
  onFailfun(){
    return
  },
  // 获取页面数据
  getPageData: function() {
    var that = this
    var data = {
      user_id: wx.getStorageSync('user_id'),
      v: app.globalData.v,
      state_mark: that.data.mark,
      page_size: pageSize,
      page: pageIndex
    }
    console.log(data)
    http.postReq('orderlist', data, function(res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        wx.hideLoading()
        var result = modelUtils.getList(res.result)
        console.log(111111111, result)
        if (pageIndex == 1) {
          if (result.length) {
            that.setData({
              orderList: result,
              loadMore: result.length == pageSize,
              showNoData: false,
            })
          } else {
            that.setData({
              showNoData: true,
              orderList: []
            })
          }
        } else {
          var orderList = that.data.orderList
          orderList = orderList.concat(result)
          that.setData({
            orderList: orderList,
            loadMore: result.length == pageSize
          })

        }
      } else {
        console.log(123456)
        if (pageIndex == 1) {
          console.log(123456)
          that.setData({
            showNoData: true,
            orderList: []
          })
        } else {
          that.setData({
            loadMore: false
          })
        }
      }
    })
  },
  // 订单操作
  getEditOrder(order_id, mark_type) {
    var that = this
    var data = {
      v: app.globalData.v,
      order_id: order_id,
      user_id: wx.getStorageSync('user_id'),
      mark_type: mark_type
    }
    console.log(data)
    http.postReq('editorder', data, function(res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 2000
        })
        setTimeout(function() {
          pageIndex = 1;
          that.getPageData();
        }, 2000)
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
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