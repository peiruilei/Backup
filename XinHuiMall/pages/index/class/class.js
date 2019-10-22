// pages/index/class/class.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    showNoData: false,
    second_class_list: [],
    class_list: [],
    first_class_id:0,
    second_class_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        var pro = parseFloat(750 / res.windowWidth).toFixed(2) //px换算rpx 

        var height = res.windowHeight * pro;
        that.setData({
          height: height
        })

      },
    })
    that.getPageData()
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
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "firstclasslist",
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
            if (i == 0) {
              result[i].isSelect = true
              that.setData({
                first_class_id:result[i].first_class_id
              })
            } else {
              result[i].isSelect = false
            }
          }

          that.setData({
            class_list: result,
            second_class_list: result[0].second_class_list,
          })

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

  //获取页面数据
  getSecondPageData: function(goods_class_id) {
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
    para["goods_class_id"] = encryptUtils.base64Encode(goods_class_id);
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

          that.setData({
            second_class_list: result,
            showNoData:false
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

  // 选左边分类
  selectClassPressed: function(event) {
    var classList = this.data.class_list
    var class_id = event.currentTarget.dataset.class_id
    var index = event.currentTarget.dataset.index

    for (var i = 0; i < classList.length; i++) {
      classList[i].isSelect = false;
    }
    classList[index].isSelect = true;

    this.setData({
      class_list: classList,
      first_class_id:class_id
    })
    this.getSecondPageData(class_id)
  },

  // 点击二级分类
  selectSecondPressed: function(event) {
    var second_class_id = event.currentTarget.dataset.class_id
    var className = event.currentTarget.dataset.class_name
    wx.navigateTo({
      url: '/pages/index/goods/goodsList/secondlist/secondlist?second_class_id=' + second_class_id + "&first_class_id=" + this.data.first_class_id + "&class_name=" + className,
    })

  },
})