// pages/index/redEnvelopeList/redEnvelopeList.js
var app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var pageIndex = 1
var pageSize = 10
var loading = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
      redEnvelopes:[],
      site:'郑州',
      num:15,
      redenvelop_button: imagePath + app.globalData.red_envelop_rush, 
      city_id:149,
      loadMore:false,
      showNoData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    pageIndex = 1
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
    this.getPageData()
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
    pageIndex = 1
    this.getPageData()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMoreData()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  //改变当前地址
  changeSite: function () {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    wx.navigateTo({
      url: '',
    })
  },
  // 红包--立即开抢功能
  redEnvelopesDetail: function (event) {
    var redpacket_id = event.currentTarget.id
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    console.log(redpacket_id)
    wx.navigateTo({
      url: '/pages/index/redEnvelopeList/redEnvelopesDetail/redEnvelopesDetail?redpacket_id=' + redpacket_id,
    })
  },

  // 获得页面数据
  getPageData:function(){
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var para = {}
    // var userID = wx.getStorageSync('user_id')
    var cityID = this.data.city_id
    // para['user_id'] = encryptUtils.base64Encode(userID)
    para['user_id'] = encryptUtils.base64Encode('1')
    para['city_id'] = encryptUtils.base64Encode(cityID)
    para['page_size'] = encryptUtils.base64Encode(pageSize)
    para['v'] = encryptUtils.base64Encode(app.globalData.v)
    para['page'] = encryptUtils.base64Encode(pageIndex)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    var that = this
    wx.request({
      url: app.globalData.ip + 'redpacklist',
      method: 'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data:{
        'para':urlStr
      },
      success:function(res){
        var code = res.data.code
        var msg = res. data.msg
        console.log(res)
        if(code == 100){
          var result = modelUtils.getModel(res.data.result)
          var loadMore = result.red_pack_list.length == pageSize
          console.log(result)
          if(pageIndex == 1){
            that.setData({
              // 商家数量疑似少1
              num: result.shop_num,
              redEnvelopes: result.red_pack_list,
              loadMore: loadMore,
              showNoData: false
            })
          }else{
            var list = that.data.redEnvelopes
            list = list.concat(result.red_pack_list)
            that.setData({
              redEnvelopes: list,
              loadMore: loadMore,
              showNoData: false
            })
          }
        }else{
          wx.showToast({
            title: msg,
            icon: 'none',
          })
          if(pageIndex == 1){
            if (pageIndex == 1) {
              that.setData({
                showNoData: true,
                loadMore: false
              })
            } else {
              that.setData({
                loadMore: false
              })
            }
          }
        }
      },
      fail:function(){
        wx.showToast({
          title: '网络异常',
          icon:'none'
        })
      },
      complete:function(){
        if(wx.hideLoading){
          wx.hideLoading()
        }
      }
    })
  },
  //加载更多
  getMoreData:function(){
    var loadMore = this.data.loadMore
    if(loadMore && !loading){
      console.log('init  ---  judent')
      pageIndex += 1
      this.getPageData()
    }
  }
})