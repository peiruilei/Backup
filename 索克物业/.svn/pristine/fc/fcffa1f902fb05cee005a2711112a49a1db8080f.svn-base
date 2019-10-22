// pages/orderDetail/commentOrder/commentOrder.js

const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据s
   */
  data: {
    comment_star: imagePath + app.globalData.comment_star,
    comment_star_gary: imagePath + app.globalData.comment_star_gary,
    commentScoreArray: [{
      "name": "及时率", //及时率评分
      "score": 0,
    }, {
      "name": "工作态度", //服务态度评分
      "score": 0,
    }, {
      "name": "工作技能", //工作技能评分
      "score": 0,
    }],
    stars:[1,2,3,4,5],
    comment_content: "", //评论内容
    order_id: 0, //订单ID
    order_result_gallery_list: [], //成果
    order_info: {}, //订单信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var orderInfo = JSON.parse(options.order_info);
    this.setData({
      order_id: orderInfo.order_id,
      order_result_gallery_list: orderInfo.order_result_gallery_list,
      order_info: orderInfo,
    })

    // 如果是接口获取的
    // this.getPageData()

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  // 改变星星
  changeColor: function(event) {
    var index = event.currentTarget.dataset.index
    var id = event.currentTarget.dataset.id

    var commentScoreArray = this.data.commentScoreArray
    commentScoreArray[index].score = id
    this.setData({
      commentScoreArray: commentScoreArray,
    })
  },
  // 输入评价内容
  inputCommentContentPressed: function(event) {
    var content = event.detail.value
    this.setData({
      comment_content: content,
    })
  },

  // 点击图片
  selectImgPressed: function(event) {
    var imgArray = event.currentTarget.dataset.galleryarray
    var currentImg = event.currentTarget.dataset.current
    var url = [];
    for (var i = 0; i < imgArray.length; i++) {
      url[i] = imgArray[i].result_big_img
    }

    wx.previewImage({
      urls: url,
      current: currentImg,
    })

  },
  // 提交评价
  submitPressed: function() {
    var commentScoreArray = this.data.commentScoreArray
    var commentContent = this.data.comment_content
    // console.log(commentScoreArray[0].score, commentScoreArray[1].score, commentScoreArray[2].score)
    for (var i = 0; i < commentScoreArray.length; i++) {
      if (i == 0) {
        if (commentScoreArray[i].score == 0) {
          wx.showToast({
            title: '请对及时率进行评分',
            icon: "none"
          })
          return;
        }
      } else if (i == 1) {
        if (commentScoreArray[i].score == 0) {
          wx.showToast({
            title: '请对工作态度进行评分',
            icon: "none"
          })
          return;
        }
      } else {
        if (commentScoreArray[i].score == 0) {
          wx.showToast({
            title: '请对工作技能进行评分',
            icon: "none"
          })
          return;
        }
      }
    }
    if (commentContent.length == 0) {
      wx.showToast({
        title: '请输入评论内容',
        icon: "none"
      })
      return;
    }

    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["comment_content"] = encryptUtils.base64Encode(commentContent)
    para["order_id"] = encryptUtils.base64Encode(that.data.order_id)
    para["time_liness_score"] = encryptUtils.base64Encode(commentScoreArray[0].score)
    para["work_attitude_score"] = encryptUtils.base64Encode(commentScoreArray[1].score)
    para["work_skills_score"] = encryptUtils.base64Encode(commentScoreArray[2].score)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "order/addordercomment",
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
        wx.hideLoading()
        if (code == 100) {
          // var result = modelUtils.getModel(res.data.result)
          wx.showToast({
            title: msg,
          })

          setTimeout(function() {
            var pages = getCurrentPages()
            var lastPages = pages[pages.length - 2]
            lastPages.getPageData();
            wx.navigateBack({
              delta: 1
            })
          }, 1000)

        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
        }
      },
      fail: function() {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function() {}
    })
    
  },

  //获取评价前的信息(现在是从订单详情传的值)
  getPageData: function() {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["order_id"] = encryptUtils.base64Encode(that.data.order_id)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "order/orderdetailcomment",
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
        wx.hideLoading()
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)
          that.setData({
            order_info: result,
            order_id: result.order_id,
            order_result_gallery_list: result.order_result_gallery_list,
            showNoData: false,
          })
        } else {
          wx.showToast({
            title: msg,
            icon: "none"
          })
          that.setData({
            showNoData: true,
            msg: msg
          })
        }
      },
      fail: function() {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
        that.setData({
          showNoData: true,
          msg: '网络异常',
        })
      },
      complete: function() {}
    })
  },

})