var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'EGHBZ-UDPCD-MRF4U-PGWH3-AAKOS-VZBYV'
});
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../utils/HHEncryptUtils.js')
var modelUtils = require('../../utils/HHModelUtils.js')
var utils = require('../../utils/util.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment_star: imagePath + app.globalData.comment_star,
    comment_star_gary: imagePath + app.globalData.comment_star_gary,
    order_map_pop: imagePath + app.globalData.order_map_pop,
    order_id: 0,
    orderInfo: {},
    markers: [],
    master_now_lat: 0,
    master_now_lng: 0,
    master_distance: 0,
    timer: '', //定时器名字
    countDownNum: '30' //倒计时初始值
  },
  //倒计时
  countDown: function() {
    let that = this;
    let countDownNum = that.data.countDownNum;
    that.setData({
      timer: setInterval(function() {
        countDownNum--;
        that.setData({
          countDownNum: countDownNum
        })
        if (countDownNum == 0) {
          that.setData({
            countDownNum: 10
          })
          that.countDown();
          that.getMasterUserLocation();
          console.log("1******更新位置******1")
        }
      }, 1000)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      order_id: options.order_id
    })
    console.log(this.data.order_id)
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
    console.log("生命周期函数--监听页面隐藏")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    clearInterval(this.data.timer);
    console.log("生命周期函数--监听页面卸载")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getPageData()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  //订单详情
  getPageData: function() {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var that = this
    var para = {}
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["mark_type"] = encryptUtils.base64Encode(1)
    para["order_id"] = encryptUtils.base64Encode(that.data.order_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    console.log(app.globalData.ip + "order/orderdetail")
    wx.request({
      url: app.globalData.ip + "order/orderdetail",
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
          var needData = res.data.result
          var order_info = modelUtils.getModel(needData)
          console.log(order_info)
          that.setData({
            orderInfo: order_info,
            master_now_lng: order_info.master_now_lng,//113.534569,
            master_now_lat: order_info.master_now_lat,//34.741982, //
            master_distance: order_info.distance,
          })


          //订单状态为2（进行中）时，要定时更新师傅位置
          if (order_info.order_state == 2) {
            var mark = []
            var marker = {}
            var callout = {}
            callout.content = order_info.master_order_state == 1 ? "距您" + that.data.master_distance + "km" : order_info.master_order_state == 1 ? "师傅已到达" : "正在服务中";
            callout.fontSize = 14;
            callout.color = '#ff5000';
            callout.bgColor = '#fff';
            callout.padding = 8;
            callout.borderRadius = 4;
            callout.boxShadow = '4px 8px 16px 0 rgba(0)';
            callout.display = 'ALWAYS';
            marker.callout = callout;

            marker.latitude = that.data.master_now_lat;
            marker.longitude = that.data.master_now_lng;
            marker.iconPath = that.data.order_map_pop;
            marker.width = 59;
            marker.height = 63.5;
            marker.id = 0;
            mark.push(marker)
            that.setData({
              markers: mark
            })

            if (order_info.order_state == 2 && order_info.master_order_state == 1){
              that.countDown();
            }else{
              clearInterval(that.data.timer);
            }
            
          }
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: msg,
          icon: 'success',
        })
      },
      complete: function() {
        wx.stopPullDownRefresh()
        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })
  },
  //获取师傅经纬度
  getMasterUserLocation: function() {
    var that = this
    var para = {}
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(1)
    para["order_id"] = encryptUtils.base64Encode(that.data.order_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    console.log(app.globalData.ip + "order/masteruserlocation")
    wx.request({
      url: app.globalData.ip + "order/masteruserlocation",
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
          var needData = res.data.result
          var result = modelUtils.getModel(needData)
          console.log(result)
          that.setData({
            master_now_lng: result.master_now_lng,
            master_now_lat: result.master_now_lat,
            master_distance: result.distance,
          })
        } else {
          // wx.showToast({
          //   title: msg,
          //   icon: 'none',
          // })
        }
      },
      fail: function(res) {
        // wx.showToast({
        //   title: msg,
        //   icon: 'success',
        // })
      },
      complete: function() {
        wx.stopPullDownRefresh()
        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })
  },
  //拨打电话
  callPhone: function(event) {
    wx.makePhoneCall({
      phoneNumber: event.currentTarget.dataset.tel,
    })
  },
  //看大图
  lookBigImgClick: function(event) {
    var index = event.currentTarget.dataset.index;
    var galleryList = event.currentTarget.dataset.gallerylist;
    index = parseInt(index)
    var urls = []
    for (var i = 0; i < galleryList.length; i++) {
      urls[i] = galleryList[i].order_source_img.length > 0 ? galleryList[i].order_source_img : galleryList[i].result_source_img
    }
    wx.previewImage({
      urls: urls,
      current: urls[index],
    })
  },
  //看大图
  lookResultBigImgClick: function (event) {
    var index = event.currentTarget.dataset.index;
    var galleryList = event.currentTarget.dataset.gallerylist;
    index = parseInt(index)
    var urls = []
    for (var i = 0; i < galleryList.length; i++) {
      urls[i] = galleryList[i].result_source_img.length > 0 ? galleryList[i].result_big_img : galleryList[i].result_thumb_img
    }
    wx.previewImage({
      urls: urls,
      current: urls[index],
    })
  },
  //验收完成并支付
  goToOrderPay: function() {
    var that = this
    if (that.data.orderInfo.order_state == 3){
      //已验收，待支付
      wx.showModal({
        title: '提示',
        content: '您确定支付该订单吗？',
        confirmColor: '#e82f2f',
        success: function (res) {
          if (res.confirm) {
            //支付
            that.wxLogin(that.data.orderInfo.order_sn)
          }
        }
      })
    }else{
      if (that.data.orderInfo.service_fees > 0) {
        wx.showModal({
          title: '提示',
          content: '您确定验收并支付该订单吗？',
          confirmColor: '#e82f2f',
          success: function (res) {
            if (res.confirm) {
              that.confirmOrderByUser()
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您确定验收该订单吗？',
          confirmColor: '#e82f2f',
          success: function (res) {
            if (res.confirm) {
              that.confirmOrderByUser()
            }
          }
        })
      }
    }
    
    
  },
  //取消订单
  cancelOrderTap: function() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要取消该订单吗？',
      confirmColor: '#e82f2f',
      success: function(res) {
        if (res.confirm) {
          that.cancelOrderByUser()
        }
      }
    })
  },
  //删除订单
  deleteOrderTap: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要删除该订单吗？',
      confirmColor: '#e82f2f',
      success: function (res) {
        if (res.confirm) {
          that.deleteOrderByUser()
        }
      }
    })
  },
  //订单评价
  commentOrderTap: function() {
    wx.navigateTo({
      url: '/pages/orderDetail/commentOrder/commentOrder?order_info=' + JSON.stringify(this.data.orderInfo),
    })
  },
  //用户取消订单
  cancelOrderByUser: function() {
    var that = this
    var para = {}
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync('user_id'));
    para["order_id"] = encryptUtils.base64Encode(that.data.order_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "order/cancelorderbyuser",
      method: 'POST',
      header: {
        'From': "WeChat",
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: msg,
            icon: "none"
          })

          that.getPageData()
          //刷新列表
          var pages = getCurrentPages()
          var lastPages = pages[pages.length - 2]
          lastPages.getPageData();

        } else {
          var message = res.data.msg
          wx.showToast({
            title: message,
            icon: "none"
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function() {}
    })
  },
  //用户删除订单
  deleteOrderByUser: function () {
    var that = this
    var para = {}
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync('user_id'));
    para["order_id"] = encryptUtils.base64Encode(that.data.order_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "order/deleteorderbyuser",
      method: 'POST',
      header: {
        'From': "WeChat",
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: msg,
            icon: "none"
          })

          //刷新列表
          var pages = getCurrentPages()
          var lastPages = pages[pages.length - 2]
          lastPages.getPageData();
          wx.navigateBack({
            delta: 1,
          });
        } else {
          var message = res.data.msg
          wx.showToast({
            title: message,
            icon: "none"
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () { }
    })
  },
  //用户验收订单
  confirmOrderByUser: function() {
    var that = this
    var para = {}
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync('user_id'));
    para["order_id"] = encryptUtils.base64Encode(that.data.order_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "order/confirmorderbyuser",
      method: 'POST',
      header: {
        'From': "WeChat",
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: msg,
            icon: "none"
          })
          if (that.data.orderInfo.service_fees > 0) {
            //
            that.wxLogin(that.data.orderInfo.order_sn)
          }
          that.getPageData()
        } else {
          var message = res.data.msg
          wx.showToast({
            title: message,
            icon: "none"
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function() {}
    })
  },
  /**
   * 微信登录 (授权登录)
   */
  wxLogin: function(order_sn) {
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在处理',
        mask: true
      })
    }
    var that = this
    wx.login({
      success: function(res) {
        console.log("result1111111==" + JSON.stringify(res))
        if (res.code) {
          that.getOpenId(order_sn, res.code)
        } else {
          wx.showToast({
            title: '处理失败',
          })
        }
      }
    });
  },
  /**
   * 根据 js_code 换取 openId
   */
  getOpenId: function(order_sn, js_code) {
    var para = {}
    para["js_code"] = js_code;
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("获取openid  urlStr==" + urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "mini.system/useropenid",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        var code = res.statusCode
        if (code == 200) {
          var openId = res.data.openid;
          //去支付
          that.hybridPayCashier(order_sn, openId)
        } else {
          var message = res.errMsg
          console.log("message==" + message)
          wx.showToast({
            title: message,
          })
        }
        console.log("res.data.openId==" + res.data.openid) //获取openid 
      },
      fail: function() {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function() {
        wx.hideLoading()
      }

    })
  },
  //混合收银台支付
  hybridPayCashier: function(order_sn, open_id) {
    var that = this
    var para = {}
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync('user_id'));
    para["pay_type"] = encryptUtils.base64Encode(3);
    para["order_sn"] = encryptUtils.base64Encode(order_sn);
    para["open_id"] = encryptUtils.base64Encode(open_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "pay/hybridpaycashier",
      method: 'POST',
      header: {
        'From': "WeChat",
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: msg,
            icon: "none"
          })

          var payInfo = res.data.result
          console.log(payInfo)
          wx.requestPayment({
            'timeStamp': payInfo.timeStamp,
            'nonceStr': payInfo.nonceStr,
            'package': payInfo.package,
            'signType': "MD5",
            'paySign': payInfo.paySign,
            success: function(res) {
              setTimeout(function() {
                wx.showToast({
                  title: '支付成功',
                  icon: 'success'
                })
              }, 300)
              that.getPageData()
            },
            fail: function(res) {
              wx.showToast({
                title: "支付失败",
                icon: 'none'
              })
              console.log("fail==" + JSON.stringify(res))
            }
          })
        } else {
          var message = res.data.msg
          wx.showToast({
            title: message,
            icon: "none"
          })
        }
      },
      fail: function() {
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function() {}
    })
  },
})