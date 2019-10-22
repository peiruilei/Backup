const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')

var pageSize = 10
var pageCouponIndex = 1
var pageOrderIndex = 1

Page({

  /**
   * 页面的初始数据
   */
  data: {
    common_upload_img: imagePath + app.globalData.common_upload_img,
    writeOff_over: imagePath + app.globalData.writeOff_over,
    writeOff_date_end: imagePath + app.globalData.writeOff_date_end,
    writeOff_type: 1,
    showNoData: true,
    loadMore: false,
    writeOff_coupon_list: [],
    writeOff_order_list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (this.data.writeOff_type == 1) {
      pageOrderIndex = 1;
      this.getOrderDestroyList();
    } else {
      pageCouponIndex = 1;
      this.getRedPackDestroyList();
    }
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

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (this.data.writeOff_type == 1) {
      pageOrderIndex = 1;
      this.getOrderDestroyList();
      wx.stopPullDownRefresh();
    } else {
      pageCouponIndex = 1;
      this.getRedPackDestroyList();
      wx.stopPullDownRefresh();
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var loadMore = this.data.loadMore
    if (loadMore) {
      if (this.data.writeOff_type == 1) {
        pageOrderIndex = pageOrderIndex + 1;
        this.getOrderDestroyList();
        wx.stopPullDownRefresh();
      } else {
        pageCouponIndex = pageCouponIndex + 1;
        this.getRedPackDestroyList();
        wx.stopPullDownRefresh();
      }
    }
  },
  //订单核销
  orderWriteOffClick: function() {
    if (this.data.writeOff_type != 1) {
      this.setData({
        writeOff_type: 1
      })
      pageOrderIndex = 1;
      this.getOrderDestroyList();
    }
  },
  //券包核销
  couponWriteOffClick: function() {
    if (this.data.writeOff_type != 2) {
      this.setData({
        writeOff_type: 2
      })
      pageCouponIndex = 1;
      this.getRedPackDestroyList();
    }
  },
  // 订单核销列表
  getOrderDestroyList: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["page"] = encryptUtils.base64Encode(pageOrderIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))

    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "orderdestroylist",
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
          console.log(JSON.stringify(result))
          if (pageOrderIndex == 1) {
            if (result.length) {
              that.setData({
                writeOff_order_list: result,
                loadMore: result.length == pageSize,
                showNoData: false,
              })
            } else {
              that.setData({
                showNoData: true,
                writeOff_order_list: result,
                loadMore: result.length == pageSize,
              })
            }

          } else {
            var writeOff_order_list = that.data.writeOff_order_list
            writeOff_order_list = writeOff_order_list.concat(result)
            that.setData({
              writeOff_order_list: writeOff_order_list,
              loadMore: result.length == pageSize
            })
          }
        } else {
          if (pageOrderIndex == 1) {
            that.setData({
              showNoData: true,
              writeOff_order_list: []
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
  // 券包核销列表
  getRedPackDestroyList: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["page"] = encryptUtils.base64Encode(pageCouponIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["shop_userid"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))

    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "redpackdestroylist",
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
          console.log(JSON.stringify(result))
          if (pageCouponIndex == 1) {
            if (result.length) {
              that.setData({
                writeOff_coupon_list: result,
                loadMore: result.length == pageSize,
                showNoData: false,
              })
            } else {
              that.setData({
                showNoData: true,
                writeOff_coupon_list: result,
                loadMore: result.length == pageSize,
              })
            }

          } else {
            var writeOff_coupon_list = that.data.writeOff_coupon_list
            writeOff_coupon_list = writeOff_coupon_list.concat(result)
            that.setData({
              writeOff_coupon_list: writeOff_coupon_list,
              loadMore: result.length == pageSize
            })
          }
        } else {
          if (pageCouponIndex == 1) {
            that.setData({
              showNoData: true,
              writeOff_coupon_list: []
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
// 扫码核销
  scanCodeWriteOffTap: function() {
    if (this.data.writeOff_type == 1) {
      //
    } else {
      //
    }
  },
})