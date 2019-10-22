
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
    inde_address_village: imagePath + app.globalData.inde_address_village,
    index_address_icon: imagePath + app.globalData.index_address_icon,
    index_re_loaction: imagePath + app.globalData.index_re_loaction,
    index_arrow: imagePath + app.globalData.index_arrow,
    address_detail: "定位中...",//地址详情
    latitude: 0,
    longitude: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.reLocation();
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  
  /**
 * 页面相关事件处理函数--监听用户下拉动作
 */
  onPullDownRefresh: function () {
    this.reLocation();
    wx.stopPullDownRefresh();
  },
  selectVillage: function (event) {
    var villageID = event.currentTarget.id
    var villageName = event.currentTarget.dataset.name

    var pages = getCurrentPages()
    var lastPages = pages[pages.length - 2]
    lastPages.setData({
      villageID: villageID,
      villageName: villageName,
    })
    lastPages.changeTaskTypeOrVillage();
    wx.navigateBack({
      delta: 1,
    })
  },
  //重新定位
  reLocation:function(){

    wx.showLoading({
      title: '正在定位...',
    })
    var that = this;
    //定位
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        //console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        that.setData({
          latitude: latitude,
          longitude: longitude
        })
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res)
            wx.hideLoading()
            var addressDetail = res.result.address_component.province + res.result.address_component.city + res.result.address_component.district
            console.log("addressDetail==" + addressDetail)
            that.setData({
              address_detail: addressDetail
            })
            that.getAddressId()
          },
        });
      },
      fail(err) {
        wx.hideLoading()
        wx.showToast({
          title: '定位失败',
          icon: 'none'
        })
      }
    })
  },
  //获取地址ID
  getAddressId: function (type) {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["address_detail"] = encryptUtils.base64Encode(that.data.address_detail)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "user/addressbyname",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)
          console.log(JSON.stringify(result))
          that.setData({
            province_id: result.province_id,
            city_id: result.city_id,
            district_id: result.district_id,
          })
          that.getPageData()
        } else {
          that.setData({
            loadMore: false,
            msg: msg
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
  //获取页面数据
  getPageData: function (type) {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["city_id"] = encryptUtils.base64Encode(that.data.city_id)
    para["province_id"] = encryptUtils.base64Encode(that.data.province_id)
    para["district_id"] = encryptUtils.base64Encode(that.data.district_id)
    para["latitude"] = encryptUtils.base64Encode(that.data.latitude)
    para["longitude"] = encryptUtils.base64Encode(that.data.longitude)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "user/villagelist",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          var result = modelUtils.getList(res.data.result)
          that.setData({
            mainData: result
          })
        } else {
          that.setData({
            msg: msg
          })
        }
      },
      fail: function () {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
        })
      },
      complete: function () {
        wx.hideLoading()
      }
    })
  },
})