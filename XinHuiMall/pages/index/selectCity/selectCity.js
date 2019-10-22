// pages/index/selectCity/selectCity.js
var QQMapWX = require('../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'EGHBZ-UDPCD-MRF4U-PGWH3-AAKOS-VZBYV'
});

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
    city_list: [],
    letterArray: [],
    letter: "loc",
    loction_city_name:"定位中...",
    loction_city_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
          widthPro: 750 / res.windowWidth
        })
      },
    })

    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        wx.setStorageSync("latitude", res.latitude)
        wx.setStorageSync("longitude", res.longitude)
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            var goods_detail = res.result.address_component.province + res.result.address_component.city + res.result.address_component.city
            that.getCityID(goods_detail, res.result.address_component.city);
          },
        });
      },
      fail(err) {
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        })
      }
    })

    this.getPageData()
  },


  //获取城市ID
  getCityID: function (address_detail, city_name) {
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
          that.setData({
            loction_city_name:city_name,
            loction_city_id:result.city_id
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
      url: app.globalData.ip + "regionlist",
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
          that.dealCityData(result)
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

  dealCityData: function(cityList) {
    var storeCity = new Array(26);
    var openCityList = cityList;
    const words = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"]
    words.forEach((item, index) => {
      storeCity[index] = {
        key: item,
        list: []
      }
    })
    openCityList.forEach((item) => {
      var firstName = item.initial_letter.substring(0, 1);
      var index = words.indexOf(firstName);
      storeCity[index].list.push({
        name: item.region_name,
        key: firstName,
        id: item.region_id,
      });
    })
    var newStoreCity = new Array();
    var letterArray = new Array();
    letterArray[0] = "loc"
    var j = 0;
    for (var i = 0; i < storeCity.length; i++) {
      if (storeCity[i].list.length != 0) {
        newStoreCity[j] = storeCity[i]
        letterArray[j+1] = newStoreCity[j].key
        j++;
      }
    }
    // this.data.cities = storeCity;
    // this.setData({
    //   cities: newStoreCity
    // })
    this.setData({
      city_list: newStoreCity,
      letterArray: letterArray
    })
  },

  selectWordIndex: function(event) {
    var letter = event.currentTarget.dataset.letter;
    
      this.setData({
        letter: letter,
      })
  },
  //点击城市
  selectCityPressed:function(event){
    var city_id = event.currentTarget.dataset.city_id
    var city_name = event.currentTarget.dataset.city_name
    if(city_id == 0){

    }else{
      wx.setStorageSync("home_city_id", city_id)
      wx.setStorageSync("home_city_name", city_name)

      var pages = getCurrentPages()
      var lastPages = pages[pages.length - 2]
      lastPages.setData({
        city_id:city_id,
        city_name:city_name
      })
      lastPages.getPageData();

      wx.navigateBack({
        delta:1
      })

    }
  },


})