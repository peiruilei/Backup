// pages/index/redEnvelopeList/redEnvelopesDetail/redEnvelopesDetail.js
var app = getApp()
var v = app.globalData.v
var ip = app.globalData.ip
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    redpacket:{},
    addredpacket:{},
    redpacketID:0,
    userID: 1,
    cover:false,
    shareRedpacket:false,
    receiveRedpacket:false,
    backgroundImage: imagePath + app.globalData.new_red_page_bg,
    popupRedpacket: imagePath + app.globalData.new_red_popup_bg,
    redlineLeft: imagePath + app.globalData.red_line_left,
    redlineRight: imagePath + app.globalData.red_line_right,
    redpacketBg: imagePath + app.globalData.shops_red_bg,
    gotrenpacket: imagePath + app.globalData.quick_get_red_bg,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.redpacket_id)
    this.setData({
      redpacket_id:options.redpacket_id,
    })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    var that =this
    return {
      title: this.data.redpacket.share_title,
      path: this.data.redpacket.share_url,
      imageUrl: '',
    }
  },
  //点击抢红包
  button_tap:function(){
    var that = this
    var para = {}
    para['v'] = encryptUtils.base64Encode(v)
    para['redpacket_id'] = encryptUtils.base64Encode('2')
    para['user_id'] = encryptUtils.base64Encode('3')
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.request({
      url: ip + 'addredpack',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        var code = res.data.code
        var msg = res.data.msg
        console.log(res)
        if(code == 100){
          wx.showToast({
            title: '恭喜您抢中红包,请先分享以获取红包',
            icon:'none'
          })
          var result = modelUtils.getModel(res.data.result)
          console.log(result)
          setTimeout(function(){
            that.setData({
              cover: true,
              shareRedpacket: true,
              addredpacket:result,
            })
          },500)
        }else{
          wx.showToast({
            title: msg,
            icon: 'none'
          })
          }
      }
    })
  },
  //点击分享转发
  clickShare:function(){
    var that = this
    var para = {}
    para['v'] = encryptUtils.base64Encode(v)
    para['user_id'] = encryptUtils.base64Encode('5')
    para['mark_type'] = encryptUtils.base64Encode('1')
    para['receive_record_id'] = encryptUtils.base64Encode('1')
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.request({
      url: ip + 'shareorabandonchampionredpacket',
      method:"POST",
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data:{
        'para':urlStr
      },
      success:function(res){
        console.log(res)
      }
    })
    this.setData({
      receiveRedpacket:true,
      shareRedpacket:false
    })
  },
  //关闭分享页面
  closeShareView:function(){
    var that = this
    wx.showModal({
      title: '提示',
      content: '您确定要放弃分享红包吗？',
      success:function(res){
        if(res.cancel){
          return
        }
        console.log("取消成功！")
        var para = {}
        para['v'] = encryptUtils.base64Encode(v)
        para['user_id'] = encryptUtils.base64Encode('5')
        para['mark_type'] = encryptUtils.base64Encode('2')
        para['receive_record_id'] = encryptUtils.base64Encode('1')
        var str = JSON.stringify(para)
        var urlStr = encodeURIComponent(str)
        wx.request({
          url: ip + 'shareorabandonchampionredpacket',
          method: "POST",
          header: {
            'content-type': 'application/x-www-form-urlencoded',
            'From': "WeChat"
          },
          data: {
            'para': urlStr
          },
          success: function (res) {
            console.log(res)
          }
        })
        if (that.data.cover) {
          if (that.data.shareRedpacket) {
            that.setData({
              cover: false,
              shareRedpacket: false
            })
            return
          }
          if (that.data.receiveRedpacket) {
            that.setData({
              receiveRedpacket: false,
              cover: false
            })
            return
          }
        }
      }
    })
  },
  //关闭红包页面
  closeView: function () {
    if (this.data.cover) {
      if (this.data.shareRedpacket) {
        this.setData({
          cover: false,
          shareRedpacket: false
        })
        return
      }
      if (this.data.receiveRedpacket) {
        this.setData({
          receiveRedpacket: false,
          cover: false
        })
        return
      }
    }
  },
  //获取数据
  getPageData:function(){
    var that = this
    var para = {}
    para['user_id'] = encryptUtils.base64Encode('1')
    para['v'] = encryptUtils.base64Encode(v)
    para['redpacket_id'] = encryptUtils.base64Encode('2')
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.request({
      url: ip + 'redpackdetailshop',
      method: 'POST',
      header:{
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data:{
        'para':urlStr
      },
      success:function(res){
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if(code == 100){
          var result = modelUtils.getModel(res.data.result)
          console.log(result)
          that.setData({
            redpacket:result,
          })
        }else{
          wx.showToast({
            title: msg,
            icon: ''
          })
        }
      }
    })
  }
})