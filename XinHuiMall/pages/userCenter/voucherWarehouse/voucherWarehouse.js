// pages/userCenter/voucherWarehouse/voucherWarehouse.js
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
    no_use: imagePath + app.globalData.common_no_data,
    coupon_gift: imagePath + app.globalData.coupon_gift,
    coupon_qr: imagePath + app.globalData.coupon_qr,
    coupon_top_bg_nolight: imagePath + app.globalData.coupon_top_bg_nolight,
    coupon_top_bg: imagePath + app.globalData.coupon_top_bg,
    coupon_use: imagePath + app.globalData.coupon_use,
    tab_list: [{
        tab_name: '待使用',
        tab_num:0,
        isSelect: true,
        tab_id: 1
      },
      {
        tab_name: '已使用',
        tab_num: 0,
        isSelect: false,
        tab_id: 2
      },
      {
        tab_name: '已过期',
        tab_num: 0,
        isSelect: false,
        tab_id: 3
      },
    ],
    isQR:false,
    showNoData:false,
    loadMore:false,
    mark:1,
    couponList:[],
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
    pageIndex=1
    this.getPageData()
  },
  // 顶部tab切换
  onbarSelect(e) {
    var tab_id = e.currentTarget.dataset.tab_id
    var index = e.currentTarget.dataset.index
    var tab_list = this.data.tab_list
    if (!tab_list[index].isSelect){
      for (var i = 0; i < tab_list.length; i++) {
        if (i == index) {
          tab_list[i].isSelect = true
        } else {
          tab_list[i].isSelect = false
        }
      }
      this.setData({
        tab_list: tab_list,
        mark: tab_id,
        couponList: [],
      })
      pageIndex = 1;
      this.getPageData();
    }
    
  },
  // 出示二维码
  onUseQR(e){
    if (e.currentTarget.dataset.codeurl){
      this.setData({
        isQR: !this.data.isQR,
        codeUrl: e.currentTarget.dataset.codeurl
      })
    }else{
      this.setData({
        isQR: !this.data.isQR,
      })
    }
    
  },
  //隐藏二维码失效
  onFailQR(){
    return
  },
//转赠
  onGift(e){
    // console.log(e.currentTarget.dataset.voucher)
    // wx.setStorage({
    //   key: 'voucher',
    //   data: e.currentTarget.dataset.voucher,
    // })
    wx.navigateTo({
      url: '/pages/userCenter/voucherWarehouse/giftCoupon/giftCoupon?receive_record_id=' + e.currentTarget.dataset.receive_record_id,
    })
  },
  //优惠券详情
  onCouponDetail(e){
    wx.navigateTo({
      url: '/pages/userCenter/voucherWarehouse/couponDetail/couponDetail?receive_record_id=' + e.currentTarget.dataset.receive_record_id,
    })
  },
  getPageData: function () {
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
      url: app.globalData.ip + "redpacketreceiverecordlist",
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
          console.log(111111111, result)
          if (pageIndex == 1) {
            if (result.red_packet_list.length) {
              var tab_list = that.data.tab_list
              tab_list[0].tab_num = result.waituse_num
              tab_list[1].tab_num = result.alreadyuse_num
              tab_list[2].tab_num = result.overdue_num
              that.setData({
                tab_list:tab_list,
                couponList:result.red_packet_list,
                loadMore: result.red_packet_list.length == pageSize,
                showNoData: false,
              })
            } else {
              that.setData({
                showNoData: true,
              })
            }

          } else {
            var couponList = that.data.couponList
            couponList = couponList.concat(result.red_packet_list)
            that.setData({
              couponList: couponList,
              loadMore: result.red_packet_list.length == pageSize
            })

          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              couponList: []
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