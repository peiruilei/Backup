// pages/userCenter/address/address.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')

var pageIndex = 1
var pageSize = 1000

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_use: imagePath + app.globalData.common_no_data,
    common_select: imagePath + app.globalData.common_select,
    common_un_select: imagePath + app.globalData.common_un_select,
    common_edit: imagePath + app.globalData.common_edit,
    common_address_dele: imagePath + app.globalData.common_address_dele,
    address_location: imagePath + app.globalData.address_location,
    address_list: [],
    loadMore: false,
    showNoData: true,
    mark: 0, // 1.选择收获地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    if (options.mark) {
      this.setData({
        mark: options.mark
      })
    }

    pageIndex = 1
    this.getPageData()
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
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"));
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "addresslist",
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
              address_list: result,
              loadMore: result.length == pageSize,
              showNoData: false,
            })
          } else {
            var addressList = that.data.address_list
            addressList = addressList.concat(result)
            that.setData({
              address_list: addressList,
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
  delAddress: function(address_id) {
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
    para["user_address_id"] = encryptUtils.base64Encode(address_id);
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"));
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "deleteaddress",
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
          that.getPageData()
          setTimeout(function() {
            wx.showToast({
              title: msg,
            });
          }, 500)
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


  //设置默认
  setDefaultAddress: function(address_id) {
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
    para["user_address_id"] = encryptUtils.base64Encode(address_id);
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"));
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "setdefaultaddress",
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
          that.getPageData()
          setTimeout(function() {
            wx.showToast({
              title: "设置成功",
            });
          }, 500)
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



  // 点击收货地址
  goToDetailOrSelectPressed: function(event) {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    var item = event.currentTarget.dataset.item
    var mark = this.data.mark
    if (mark == 1) {
      var pages = getCurrentPages()
      var lastPages = pages[pages.length - 2]
      lastPages.setData({
        address_id: item.user_address_id,
        consignee: item.consignee,
        telphone: item.telphone,
        address_detail: item.province_name + item.city_name + item.district_name + item.address_detail
      })

      wx.navigateBack({
        delta: 1
      })

    } else {
      wx.navigateTo({
        url: '/pages/userCenter/address/edit/edit?address_id=' + item.user_address_id,
      })
    }


  },
  //编辑收货地址
  editAddressPressed: function(event) {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime

    var address_id = event.currentTarget.dataset.address_id
    console.log(2)
    wx.navigateTo({
      url: '/pages/userCenter/address/edit/edit?address_id=' + address_id,
    })
  },
  // 删除收货地址
  deleAddressPressed: function(event) {
    var address_id = event.currentTarget.dataset.address_id
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要删除该收货地址吗',
      success: function(res) {
        if (res.confirm) {
          that.delAddress(address_id)
        }
      },
    })
  },
  //设置默认
  setDefaultPressed: function(event) {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    var address_id = event.currentTarget.dataset.address_id
    this.setDefaultAddress(address_id)
  },

  // 添加收货地址
  addAddressPressed: function() {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    wx.navigateTo({
      url: '/pages/userCenter/address/add/add',
    })
  },

  noSetDefaultPressed:function(){

  },

})