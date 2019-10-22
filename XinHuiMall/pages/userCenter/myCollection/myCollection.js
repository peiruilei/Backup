// pages/userCenter/myCollection/myCollection.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var pageIndex = 1
var pageSize = 10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav:1,
    goodsList:[],
    shopList:[],
    showNoData: false,
    loadMore: false,
    mark:1,
    startX:0,
    startY:0,
    common_no_data: imagePath + app.globalData.common_no_data,

  },
  // 切换商品
  goodsClick(res){
    pageIndex = 1
    console.log(res)
     var nav=res.currentTarget.dataset.index
    var mark = res.currentTarget.dataset.index
     this.setData({
       nav:nav,
       mark:mark
     })
     this.getPageData()
  },
  // 切换商家
  shopClick(res){
    pageIndex = 1
    var nav = res.currentTarget.dataset.index
    var mark = res.currentTarget.dataset.index
    this.setData({
      nav: nav,
      mark: mark
    })
    this.getShopList()
  },
  // 跳转商品
  goGoods(res){
    var that=this
    var goods_id=res.currentTarget.dataset.goods_id
wx.navigateTo({
  url: '/pages/index/goods/goodsDetail/goodsDetail?goods_id=' + goods_id,
})
  },

// 跳转商家
  goShop(res){
    var shop_id = res.currentTarget.dataset.shop_id
    wx.navigateTo({
      url: '/pages/index/goods/businessDetails/businessDetails?shop_id='+shop_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   pageIndex=1
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
this.getPageData()

  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
 pageIndex=1
 this.setData({
   showNoData:false,
   loadMore:false,
 })
  },
  getPageData: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    var user_id=wx.getStorageSync("user_id")
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["page"] = encryptUtils.base64Encode(pageIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["user_id"] = encryptUtils.base64Encode(user_id)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "collectiongoodslist",
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
          wx.hideLoading()
          var result = modelUtils.getList(res.data.result)
          console.log(result)
          if (pageIndex == 1) {
            if (result.length) {
              that.setData({
                goodsList: result,
                loadMore: result.length == pageSize,
                showNoData: false,
            
              })
            } else {
              that.setData({
                showNoData: true,
                goodsList: result,
                loadMore: result.length == pageSize,
              })
            }

          } else {
            var goodsList = that.data.goodsList
            goodsList = goodsList.concat(result)
            that.setData({
              goodsList: goodsList,
              loadMore: result.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              goodsList: []
            })
          } else {
            that.setData({
              loadMore: false
            })
          }
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
  // 获取商家信息
  getShopList: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    var user_id = wx.getStorageSync("user_id")
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    para["page"] = encryptUtils.base64Encode(pageIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["user_id"] = encryptUtils.base64Encode(user_id)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "collectionshoplist",
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
          wx.hideLoading()
          var result = modelUtils.getList(res.data.result)

          console.log(result)
          if (pageIndex == 1) {
            if (result.length) {
              that.setData({
                shopList: result,
                loadMore: result.length == pageSize,
                showNoData: false,

              })
            } else {
              that.setData({
                showNoData: true,
                shopList: result,
                loadMore: result.length == pageSize,
              })
            }

          } else {
            var shopList = that.data.shopList
            shopList = shopList.concat(result)
            that.setData({
              shopList: shopList,
              loadMore: result.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              shopList: []
            })
          } else {
            that.setData({
              loadMore: false
            })
          }
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

  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    pageIndex = 1;
    this.getPageData();
    this.getShopList();
    wx.stopPullDownRefresh();
  
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var loadMore = this.data.loadMore
    if (loadMore) {
      pageIndex = pageIndex + 1
      this.getPageData()
      this.getShopList();
    }
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.shopList.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      shopList: this.data.shopList
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });

    that.data.shopList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      shopList: that.data.shopList
    })
  },

  /**
  
  * 计算滑动角度
  
  * @param {Object} start 起点坐标
  
  * @param {Object} end 终点坐标
  
  */

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  del: function (e) {
    var that = this
    var item_id = e.currentTarget.dataset.item_id
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定要取消收藏吗?',
      success: function (res) {
        if (res.confirm) {
          that.delshop(item_id, index)
        }
      }
    })
  },

  // 删除
  delshop: function (item_id, index) {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var that = this
    var para = {}
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["key_id"] = encryptUtils.base64Encode(item_id)
    para["mark_type"] = encryptUtils.base64Encode(2)//	1：收藏，2：取消收藏
    para["collect_type"] = encryptUtils.base64Encode(2)//【1：商品 2：店铺】
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "collectorcancelcollect",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        wx.hideLoading()
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: msg,
            duration: 1000,
            icon: 'none'
          })
          // 取消收藏后列表减1
          var shopList = that.data.shopList
          shopList.splice(index, 1)
          that.setData({
            shopList: shopList,
            showNoData: that.data.shopList.length == 0,
            msg: "暂无数据"
          })
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: msg,
          icon: 'success',
        })
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
  },



  //商品手指触摸动作开始 记录起点X坐标
  touchstartGoods: function (e) {
    //开始触摸时 重置所有删除
    this.data.goodsList.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      shopList: this.data.shopList
    })
  },
  //滑动商品事件处理
  touchmoveGoods: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });

    that.data.goodsList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
    //更新数据
    that.setData({
      goodsList: that.data.goodsList
    })
  },

  /**
  
  * 计算滑动角度
  
  * @param {Object} start 起点坐标
  
  * @param {Object} end 终点坐标
  
  */

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  //删除事件
  dels: function (e) {
    var that = this
    var item_id = e.currentTarget.dataset.item_id
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确定要取消收藏吗?',
      success: function (res) {
        if (res.confirm) {
          that.delshops(item_id, index)
        }
      }
    })
  },

  // 删除
  delshops: function (item_id, index) {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var that = this
    var para = {}
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["key_id"] = encryptUtils.base64Encode(item_id)
    para["mark_type"] = encryptUtils.base64Encode(2)//	1：收藏，2：取消收藏
    para["collect_type"] = encryptUtils.base64Encode(1)//【1：商品 2：店铺】
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "collectorcancelcollect",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        wx.hideLoading()
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: msg,
            duration: 1000,
            icon: 'none'
          })
          // 取消收藏后列表减1
          var goodsList = that.data.goodsList
          goodsList.splice(index, 1)
          that.setData({
            goodsList: goodsList,
            showNoData: that.data.goodsList.length == 0,
            msg: "暂无数据"
          })
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: msg,
          icon: 'success',
        })
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
  },
  
})