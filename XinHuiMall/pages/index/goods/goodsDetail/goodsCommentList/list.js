// pages/index/goods/goodsDetail/goodsCommentList/list.js

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
    common_star_red: imagePath + app.globalData.common_star_red,
    common_star_gray: imagePath + app.globalData.common_star_gray,
    comment_list:[],
    loadMore:false,
    showNoData:true,
    msg:"加载中..."
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      goods_id: options.goods_id
    })

    pageIndex = 1
    this.getPageData()
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    pageIndex = 1
    this.getPageData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var loadMore = this.data.loadMore
    if (loadMore) {
      pageIndex++
      this.getPageData()
    }
  },

  //获取页面数据
  getPageData: function () {
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
      url: app.globalData.ip + "goodscommentlist",
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

          for (var i = 0; i < result.length; i++) {
            result[i].goods_score = parseInt(result[i].goods_score)
          }

          if (pageIndex == 1) {
            that.setData({
              comment_list: result,
              loadMore: result.length == pageSize,
              showNoData: false,
            })
          } else {
            var commentList = that.data.comment_list
            commentList = qustionList.concat(result)
            that.setData({
              comment_list: commentList,
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


})