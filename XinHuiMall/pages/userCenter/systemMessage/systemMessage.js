// pages/userCenter/systemMessage/systemMessage.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var pageIndex=1
var pageSize=10
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_message_read: imagePath + app.globalData.content_message_read,
    content_message_notRead: imagePath + app.globalData.content_message_notRead,
    common_no_data: imagePath + app.globalData.common_no_data,
    systemList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    pageIndex=1,
this.getPageData()
  },

  systemClick(res) {
    var that = this
      wx.navigateTo({
        url: '/pages/userCenter/systemMessage/systemDetail/systemDetail?system_url='+res.currentTarget.dataset.info_url,
      })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  getPageData: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    var that = this
    var para = {}
    var user_id = wx.getStorageSync("user_id")
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["page"] = encryptUtils.base64Encode(pageIndex)
    para["page_size"] = encryptUtils.base64Encode(pageSize)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "mini.system/systemlist",
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
        


          for (var index in result) {
            var item = result[index]
            var add_time=result[index].add_time
            item.isTouchMove = false
          }
          if (pageIndex == 1) {
            if (result.length) {
              that.setData({
             
                systemList: result,
                loadMore: result.length == pageSize,
                showNoData: false,
              })
            } else {
              that.setData({
                showNoData: true,
                systemList: result,
                loadMore: result.length == pageSize,
              })
            }

          } else {
            var systemList = that.data.systemList
            systemList = systemList.concat(result)
            that.setData({
              systemList: systemList,
              loadMore: result.length == pageSize
            })
          }
        } else {
          if (pageIndex == 1) {
            that.setData({
              showNoData: true,
              systemList: []
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
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.systemList.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    })

    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      systemList: this.data.systemList
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

    that.data.systemList.forEach(function (v, i) {
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
      systemList: that.data.systemList
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
      content: '确定要删除该消息吗?',
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
    para["info_id"] = encryptUtils.base64Encode(item_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "mini.system/delsinglesystemusermsg",
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
            title: '删除消息成功',
            duration: 1000,
            icon: 'none'
          })
          // 取消收藏后列表减1
          var goodsList = that.data.systemList

          goodsList.splice(index, 1)

          that.setData({
            systemList: goodsList,
            showNoData: that.data.systemList.length == 0,
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    pageIndex = 1;
    this.getPageData();
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
    }
  },

    

    })