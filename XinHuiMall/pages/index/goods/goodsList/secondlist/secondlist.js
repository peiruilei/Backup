// pages/index/goods/goodsList/secondlist/secondlist.js

const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../../utils/HHModelUtils.js')
var utils = require('../../../../../utils/util.js')
var segmentation = require('../../../../../utils/segmentation.js')

var pageIndex = 1
var pageSize = app.globalData.pageSize

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_use: imagePath + app.globalData.common_no_data,
    home_search: imagePath + app.globalData.home_search,
    goods_class_red: imagePath + app.globalData.goods_class_red,
    goods_class_gray: imagePath + app.globalData.goods_class_gray,
    second_class_id: 0,
    first_class_id: 0,
    class_list: [],
    second_class_list: [],
    order_type: 0,
    order_name: "智能排序",
    distance_type: 0,
    distance_name: "全城",
    kerWorks: "",
    select_type: 0,
    showNoData: true,
    loadMore: false,
    msg:"请稍等...",
    distance_list: [{
      distance_id: 0,
      distance_name: "全城",
      is_select: 1,
    }, {
      distance_id: 1,
      distance_name: "1km",
      is_select: 0,
    }, {
      distance_id: 2,
      distance_name: "3km",
      is_select: 0,
    }, {
      distance_id: 3,
      distance_name: "5km",
      is_select: 0,
    }, {
      distance_id: 4,
      distance_name: "10km",
      is_select: 0,
    }],

    order_list: [{
      order_id: 0,
      order_name: "智能排序",
      is_select: 1,
    }, {
      order_id: 1,
      order_name: "评价最高",
      is_select: 0,
    }, {
      order_id: 2,
      order_name: "人气最高",
      is_select: 0,
    }, {
      order_id: 3,
      order_name: "离我最近",
      is_select: 0,
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: options.class_name,
    })

    if (options.first_class_id) {
      this.setData({
        first_class_id: options.first_class_id
      })
      this.getSecondPageData(options.first_class_id)
    }else{
      this.getSecondPageData(0)
    }

    if (options.second_class_id) {
      this.setData({
        second_class_id: options.second_class_id
      })
    }

    this.getPageData();
    this.getFirstClassData()
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
    para["city_id"] = encryptUtils.base64Encode(wx.getStorageSync("home_city_id") > 0 ? wx.getStorageSync("home_city_id") : 0);
    para["order_type"] = encryptUtils.base64Encode(that.data.order_type);
    para["distance_type"] = encryptUtils.base64Encode(that.data.distance_type);
    para["first_class_id"] = encryptUtils.base64Encode(that.data.first_class_id);
    para["second_class_id"] = encryptUtils.base64Encode(that.data.second_class_id);
    para["user_lng"] = encryptUtils.base64Encode(wx.getStorageSync("longitude") > 0 ? wx.getStorageSync("longitude") : 0);
    para["user_lat"] = encryptUtils.base64Encode(wx.getStorageSync("latitude") > 0 ? wx.getStorageSync("latitude") : 0);
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
              loadMore: false,
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

  //获取页面数据
  getFirstClassData: function() {
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

          var array = [{
              first_class_id: 0,
              first_class_name: "全部分类",
              second_class_list: []
            }],

            result = array.concat(result)


          for (var i = 0; i < result.length; i++) {
            if (result[i].first_class_id == that.data.first_class_id) {
              result[i].is_select = true
            } else {
              result[i].is_select = false
            }
          }

          that.setData({
            class_list: result,
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
  getSecondPageData: function(classID) {
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
    para["goods_class_id"] = encryptUtils.base64Encode(classID);
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

          var array = [{
              second_class_id: 0,
              second_class_name: "全部",
            }],

            result = array.concat(result)

          for (var i = 0; i < result.length; i++) {
            if (result[i].second_class_id == that.data.second_class_id) {
              result[i].is_select = true
            } else {
              result[i].is_select = false
            }
          }

          that.setData({
            second_class_list: result,
          })

        }else if(code == 101){
          that.setData({
            second_class_list: [{
              second_class_id: 0,
              second_class_name: "全部",
            }],
          })
        }else {
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
  showspecificationPressed: function(event) {
    var that = this

    var select_type = that.data.select_type

    if (select_type == event.currentTarget.dataset.mark) {
      that.hiddenSpecification()
      return;
    }

    this.setData({
      showSpecification: true,
      select_type: event.currentTarget.dataset.mark
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
        showSpecification: false,
        select_type: 0,
      })

    }, 400)
  },

  noHiddenSpecification: function() {

  },

  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  fadeDown: function() {
    this.animation.translateY(-wx.getSystemInfoSync().windowHeight).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  //进入商品详情
  goToGoodsDetailPressed: function(event) {
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

  selectSecondClassPress: function(event) {
    var second_class_id = event.currentTarget.dataset.second_class_id
    wx.navigateTo({
      url: '/pages/index/goods/goodsList/secondlist/secondlist?second_class_id=' + second_class_id + "&first_class_id=" + this.data.first_class_id,
    })
  },

  goToSearchPressed: function(event) {
    wx.navigateTo({
      url: '/pages/index/search/search?mark=' + 1,
    })
  },

  // 选择区域
  selectDistancePressed: function(event) {
    var index = event.currentTarget.dataset.index
    var distance_list = this.data.distance_list
    for (var i = 0; i < distance_list.length; i++) {
      if (i == index) {
        distance_list[i].is_select = 1
        this.setData({
          distance_type: distance_list[i].distance_id,
          distance_name: distance_list[i].distance_name,
        })
      } else {
        distance_list[i].is_select = 0
      }
    }

    this.setData({
      distance_list: distance_list,
    })

    this.hiddenSpecification()
    this.getPageData()
  },
  //选择排序
  selectOrderPressed: function(event) {
    var index = event.currentTarget.dataset.index
    var order_list = this.data.order_list
    for (var i = 0; i < order_list.length; i++) {
      if (i == index) {
        order_list[i].is_select = 1
        this.setData({
          order_type: order_list[i].order_id,
          order_name: order_list[i].order_name,
        })
      } else {
        order_list[i].is_select = 0
      }
    }

    this.setData({
      order_list: order_list,
    })

    this.hiddenSpecification()
    this.getPageData()
  },

  // 点击一级分类
  selectFirstClassPressed: function(event) {
    var index = event.currentTarget.dataset.index
    var firstClassList = this.data.class_list
    var class_id = 0
    for (var i = 0; i < firstClassList.length; i++) {
      if(i == index){
        firstClassList[i].is_select = true
        class_id = firstClassList[i].first_class_id
      }else{
        firstClassList[i].is_select = false
      }
    }
    this.setData({
      class_list:firstClassList
    })
    this.getSecondPageData(class_id)
  },

  selectSecondClassPressed:function(event){
    var index = event.currentTarget.dataset.index
    var firstClassList = this.data.class_list
    var secondClassList = this.data.second_class_list
    var second_class_id = 0
    for (var i = 0; i < secondClassList.length; i++) {
      if (i == index) {
        this.setData({
          second_class_id: secondClassList[i].second_class_id
        })
        secondClassList[i].is_select = true
      } else {
        secondClassList[i].is_select = false
      }
    }
    for (var i = 0; i < firstClassList.length; i++) {
      if (firstClassList[i].is_select == true){
        this.setData({
          first_class_id: firstClassList[i].first_class_id
        })
      }
    }
    this.setData({
      second_class_list:secondClassList
    })
    this.hiddenSpecification()

    this.getPageData()
  },

})