// pages/index/goods/goodsDetail/goodsQuestionList/list.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../../utils/HHModelUtils.js')
var utils = require('../../../../../utils/util.js')

var pageIndex = 1
var pageSize = app.globalData.pageSize

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id: 0,
    loadMore: false,
    showNoData: true,
    msg: "请稍等...",
    qustion_list: [],
    isShowAskQuestion: false,
    animationData: {},
    question_content: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      goods_id: options.goods_id
    })

    pageIndex = 1
    this.getPageData()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    pageIndex = 1
    this.getPageData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var loadMore = this.data.loadMore
    if (loadMore) {
      pageIndex++
      this.getPageData()
    }
  },

  //获取页面数据
  getPageData: function() {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        });
      }
    }
    var that = this;
    var para = {};
    para["page"] = encryptUtils.base64Encode(pageIndex);
    para["page_size"] = encryptUtils.base64Encode(pageSize);
    para["goods_id"] = encryptUtils.base64Encode(that.data.goods_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "goodsquestionlist",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function success(res) {
        console.log(res);
        wx.hideLoading()
        var code = res.data.code;
        var msg = res.data.msg;
        if (code == 100) {
          var result = modelUtils.getList(res.data.result)
          if (pageIndex == 1) {
            that.setData({
              qustion_list: result,
              loadMore: result.length == pageSize,
              showNoData: false,
            })
          } else {
            var qustionList = that.data.qustion_list
            qustionList = qustionList.concat(result)
            that.setData({
              qustion_list: qustionList,
              loadMore: result.length == pageSize,
              showNoData: false,
            })

          }

        } else {

          if (pageIndex == 1) {
            wx.showToast({
              title: msg,
              icon: 'none'
            });
            that.setData({
              showNoData: true,
              msg: msg
            })
          } else {
            that.setData({
              showNoData: false,
              msg: msg
            })
            wx.showToast({
              title: msg,
              icon: 'none'
            });
          }

        }
      },
      fail: function fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
        that.setData({
          showNoData: true,
          msg: '网络异常'
        })
      },
      complete: function complete() {

      }
    });
  },

  //获取页面数据
  submitQuestion: function(questionContent) {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        });
      }
    }
    var that = this;
    var para = {};
    para["user_id"] = encryptUtils.base64Encode(1);
    para["question_content"] = encryptUtils.base64Encode(questionContent);
    para["goods_id"] = encryptUtils.base64Encode(that.data.goods_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "addgoodsquestion",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function success(res) {
        console.log(res);
        wx.hideLoading()
        var code = res.data.code;
        var msg = res.data.msg;
        if (code == 100) {

          that.hiddenSpecification()

          wx.showToast({
            title: msg,
            duration: 1500,
            mask:true
          });

          that.setData({
            question_content: ""
          })

          setTimeout(function() {
            that.getPageData()
          }, 1500)


        } else {

          wx.showToast({
            title: msg,
            icon: 'none'
          });
        }
      },
      fail: function fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
      },
      complete: function complete() {

      }
    });
  },


  // 显示商品规格
  showspecificationPressed: function() {
    var that = this

    this.setData({
      isShowAskQuestion: true,
    })

    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })

    this.animation = animation

    setTimeout(function() {
      that.fadeIn()
    }, 400)
  },
  // 隐藏商品规格
  hiddenSpecification: function() {
    var that = this
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })

    this.animation = animation

    that.fadeDown()

    setTimeout(function() {

      that.setData({
        isShowAskQuestion: false,
      })

    }, 400)
  },

  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  fadeDown: function() {
    this.animation.translateY(wx.getSystemInfoSync().windowHeight).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  noHiddenSpecification: function() {

  },

  inputQuestionContentPressed: function(event) {
    this.setData({
      question_content: event.detail.value
    })
  },
  // 提交
  submitPresed: function() {
    var questionContent = this.data.question_content
    if (questionContent.length == 0) {
      wx.showToast({
        title: '请输入要提问的问题！',
        icon: "none"
      })
      return;
    }

    this.submitQuestion(questionContent)

  },


})