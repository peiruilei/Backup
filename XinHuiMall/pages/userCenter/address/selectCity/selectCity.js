// pages/userCenter/address/selectCity/selectCity.js

const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var getType = 1;
var perid = 0;
var cityId = 0;
var dirId = 0;
var perName = "";
var cityName = "";
var dirName = "";
var selectType = 0;
0 //0：选择省市县 三级 1：选择省市 两级

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_back: imagePath + app.globalData.content_back,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.mark) {
      selectType = parseInt(options.mark)
    }

    getType = 1
    perid = 0
    cityId = 0
    dirId = 0
    perName = ""
    cityName = ""
    dirName = ""
    this.getPageData(1, 1)
  },

  //获取城市
  getPageData: function(pid, layer_id) {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }

    var para = {}
    para["parent_id"] = encryptUtils.base64Encode(pid)
    para["layer_id"] = encryptUtils.base64Encode(layer_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("para==" + urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "regioninfolist",
      method: 'POSt',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        var code = res.data.code
        console.log("code==" + code)
        if (code == 100) {
          var needData = res.data.result
          var addressList = modelUtils.getList(needData)
          that.setValuse(addressList)
          getType++;

        } else if (code == 101 && getType == 3) {
          var pages = getCurrentPages()
          var addPage = pages[pages.length - 2]
          var addressSrc = perName + cityName + dirName;
          addPage.setData({
            district_id: dirId,
            city_id: cityId,
            province_id: perid,
            addressSrc: addressSrc
          })
          wx.navigateBack(1)
        } else {
          var message = res.data.msg
          wx.showToast({
            title: message,
            icon: 'success',
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '网络异常',
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

  setValuse: function(addressList) {
    var baseImg = app.globalData.imagePath

    this.setData({
      address: addressList,
    })
  },
  toNext: function(event) {
    var position = event.currentTarget.id
    var id = this.data.address[position].region_id
    var name = this.data.address[position].region_name

    var that = this
    switch (getType) {
      case 1:
        break;
      case 2:
        perid = id;
        perName = name;
        that.doWhenClick(id, name)
        break;
      case 3:
        cityId = id;
        cityName = name;
        if (selectType == 0) {
          that.doWhenClick(id, name)
        } else {
          var pages = getCurrentPages()
          var addPage = pages[pages.length - 2]
          var addressSrc = perName + cityName
          addPage.setData({
            district_id: dirId,
            city_id: cityId,
            province_id: perid,
            addressSrc: addressSrc
          })
          wx.navigateBack(1)
        }
        break;
      case 4:
        dirId = id;
        dirName = name;
        var pages = getCurrentPages()
        var addPage = pages[pages.length - 2]
        var addressSrc = perName + cityName + dirName
        addPage.setData({
          district_id: dirId,
          city_id: cityId,
          province_id: perid,
          addressSrc: addressSrc
        })
        wx.navigateBack(1)
        break;
    }
  },

  doWhenClick: function(id, name) {
    wx.setNavigationBarTitle({
      title: name,
    })
    this.getPageData(id, getType)
  },
})