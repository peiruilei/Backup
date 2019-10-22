// pages/index/goods/goodsList/goodsList.js

const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var segmentation = require('../../../../utils/segmentation.js')

var pageIndex = 1
var pageSize = app.globalData.pageSize

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_use: imagePath + app.globalData.common_no_data,
    first_class_id:0,
    second_class_list:[],
    goods_list:[],
    kerWorks:"",
    showNoData:true,
    loadMore:false,
    current:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.class_id){
      this.setData({
        first_class_id:options.class_id
      })
    }
    this.getSecondPageData()
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

  },

  //获取页面数据
  getSecondPageData: function () {
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
    para["goods_class_id"] = encryptUtils.base64Encode(that.data.first_class_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "secondclasslist",
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

          var classList = segmentation.group(result,8)

          that.setData({
            second_class_list: classList,
            showNoData: false
          })

        } else {
          wx.showToast({
            title: msg,
            icon: 'none'
          });
          that.setData({
            second_class_list: [],
            showNoData: true,
            msg: msg
          })
        }
      },
      fail: function fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
        that.setData({
          second_class_list: [],
          showNoData: true,
          msg: msg
        })
      },
      complete: function complete() {

      }
    });
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
    para["city_id"] = encryptUtils.base64Encode(wx.getStorageSync("home_city_id") > 0 ? wx.getStorageSync("home_city_id") : 0);
    para["order_type"] = encryptUtils.base64Encode(0);
    para["distance_type"] = encryptUtils.base64Encode(0);
    para["first_class_id"] = encryptUtils.base64Encode(that.data.first_class_id);
    para["second_class_id"] = encryptUtils.base64Encode(0);
    para["user_lng"] = encryptUtils.base64Encode(wx.getStorageSync("longitude") > 0 ? wx.getStorageSync("longitude") : 0);
    para["user_lat"] = encryptUtils.base64Encode(wx.getStorageSync("latitude") > 0? wx.getStorageSync("latitude") : 0);
    para["key_words"] = encryptUtils.base64Encode(that.data.kerWorks);
    para["shop_id"] = encryptUtils.base64Encode(0);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "goodslist",
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
              goods_list: result,
              loadMore: result.length == pageSize,
              showNoData: false,
            })
          } else {
            var goodsList = that.data.goods_list
            goodsList = goodsList.concat(result)
            that.setData({
              goods_list: goodsList,
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
              loadMore:false,
              msg: msg
            })
          } else {
            that.setData({
              showNoData: false,
              loadMore: false,
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

  //改变swiper
  swiperChangePressed:function(event){
    this.setData({
      current:event.detail.current
    })
  },


  //进入商品详情
  goToGoodsDetailPressed: function (event) {
    if (wx.getStorageSync("user_id") > 0) {
      var goods_id = event.currentTarget.dataset.goods_id
      wx.navigateTo({
        url: '/pages/index/goods/goodsDetail/goodsDetail?goods_id=' + goods_id,
      })
    } else {
      wx.navigateTo({
        url: '/pages/login/login/userLogin',
      })
    }
  },

  selectSecondClassPress:function(event){
    var second_class_id = event.currentTarget.dataset.second_class_id
    var goodsName = event.currentTarget.dataset.second_class_name
    wx.navigateTo({
      url: '/pages/index/goods/goodsList/secondlist/secondlist?second_class_id=' + second_class_id + "&first_class_id=" + this.data.first_class_id + "&class_name=" + goodsName,
    })
  },

})