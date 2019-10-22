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
var segmentation = require('../../utils/segmentation.js')

var first = true

Page({
  data: {
    common_round_dele: imagePath + app.globalData.common_round_dele,
    home_search: imagePath + app.globalData.home_search,
    common_red_rain_bg: imagePath + app.globalData.common_red_rain_bg,
    home_class_bg: imagePath + app.globalData.home_class_bg,
    content_back: imagePath + app.globalData.content_back,
    home_select_city: imagePath + app.globalData.home_select_city,
    home_red_packet_bg: imagePath + app.globalData.home_red_packet_bg,
    like_goods_list: [],
    first_class_list: [],
    second_class_list: [],
    recommend_first_class_list: [],
    champion_reward_list:[],// 冠军红包
    city_name: "",
    city_id: 0,
    isShowView:false,
  },
  onLoad: function(options) {
    if (wx.getStorageSync("home_city_name") != "undefined" && wx.getStorageSync("home_city_name").length > 0) {
      this.setData({
        city_name: wx.getStorageSync("home_city_name")
      })
    }
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        wx.setStorageSync("latitude", res.latitude)
        wx.setStorageSync("longitude", res.longitude)
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function(res) {
            var goods_detail = res.result.address_component.province + res.result.address_component.city + res.result.address_component.city
            that.getCityID(goods_detail, res.result.address_component.city);
          },
        });
      },
      fail(err) {
        that.setData({
          city_name: "定位失败"
        })
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        })
        that.getPageData()
      }
    })
  },
  onShow: function() {
    // this.getPageData()
    if (first == true) {
      first = false
    } else {
      var that = this
      wx.getLocation({
        type: 'gcj02',
        success: function(res) {
          wx.setStorageSync("latitude", res.latitude)
          wx.setStorageSync("longitude", res.longitude)
          //你地址解析
          that.getPageData()
        },
        fail(err) {
          wx.showToast({
            title: '定位失败',
            icon: 'none'
          })
          that.getPageData()
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    return {
      title: "欢迎来到淘百趣",
      path: "/pages/index/index?puser_id=" + wx.getStorageSync("user_id"),
    }
    this.shareOraBandonChampionRedPacket(1)
  },


  //获取页面数据
  getCityID: function(address_detail, city_name) {
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
    para["address_detail"] = encryptUtils.base64Encode(address_detail);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "addressbyname",
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
          var result = modelUtils.getModel(res.data.result)
          if (wx.getStorageSync("home_city_name").length > 0 && wx.getStorageSync("home_city_name") != "undefined") {
            if (wx.getStorageSync("home_city_id") != result.city_id) {
              wx.showModal({
                title: '提示',
                content: '您当前定位的城市和当前不一致是否切换',
                success: function(res) {
                  if (res.confirm) {
                    wx.setStorageSync("home_city_id", result.city_id)
                    wx.setStorageSync("home_city_name", city_name)
                    that.setData({
                      city_name: city_name,
                    })
                    that.getPageData();
                  } else {
                    that.getPageData();
                  }
                }
              })
            } else {
              that.getPageData();
            }
          } else {
            wx.setStorageSync("home_city_id", result.city_id)
            wx.setStorageSync("home_city_name", city_name)
            that.setData({
              city_name: city_name,
            })
            that.getPageData();
          }
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
    para["user_lng"] = encryptUtils.base64Encode(wx.getStorageSync("longitude") > 0 ? wx.getStorageSync("longitude") : 0);
    para["user_lat"] = encryptUtils.base64Encode(wx.getStorageSync("latitude") > 0 ? wx.getStorageSync("latitude") : 0);
    para["city_id"] = encryptUtils.base64Encode(wx.getStorageSync("home_city_id") > 0 ? wx.getStorageSync("home_city_id") : 0);
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id") > 0 ? wx.getStorageSync("user_id") : 0);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "homeindexmodel",
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
          var result = modelUtils.getModel(res.data.result)
          var firstClassList = segmentation.group(result.first_class_list, 8);
          that.setData({
            first_class_list: firstClassList,
            second_class_list: result.second_class_list,
            like_goods_list: result.like_goods_list,
            recommend_first_class_list: result.recommend_first_class_list,
            champion_reward_list:result.champion_reward_list,
            isShowView: result.champion_reward_list.length>0?true:false
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
  shareOraBandonChampionRedPacket: function (mark_type) {
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
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"));
    para["mark_type"] = encryptUtils.base64Encode(mark_type);
    para["receive_record_id"] = encryptUtils.base64Encode(that.data.champion_reward_list[0].receive_record_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "shareorabandonchampionredpacket",
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
          wx.showToast({
            title: msg,
          });

          that.setData({
            isShowView:false,
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


  //进入搜索页
  goToSearchPressed: function() {
    wx.navigateTo({
      url: '/pages/index/search/search',
    })
  },
  // 全部分类
  goToClassPressed: function() {
    wx.navigateTo({
      url: '/pages/index/class/class',
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
  // 选择城市
  selectCityPressed: function() {
    wx.navigateTo({
      url: '/pages/index/selectCity/selectCity',
    })
  },

  //点击分类
  selectHomeClassPressed: function(event) {
    var classID = event.currentTarget.dataset.classid
    wx.navigateTo({
      url: '/pages/index/goods/goodsList/goodsList?class_id=' + classID,
    })
  },
  // 点击二级分类
  selectSecondClassPressed:function(event){
    var second_class_id = event.currentTarget.dataset.second_class_id
    var className = event.currentTarget.dataset.class_name
    wx.navigateTo({
      url: '/pages/index/goods/goodsList/secondlist/secondlist?second_class_id=' + second_class_id + "&class_name=" + className,
    })
  },
  // 放弃冠军红包
  forgetRedPacketPressed:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要放弃该红包吗',
      success:function(res){
        if(res.confirm){
          that.shareOraBandonChampionRedPacket(2)
        }
      }
    })
  },

  //进入红包雨
  goToRedPacketPressed: function() {

  },



})