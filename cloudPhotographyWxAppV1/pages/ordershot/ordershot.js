// pages/index/oedershot/ordershot.js
import *as Api from '../../http/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg:'../../static/icons/bj.png',
    tape:'../../static/icons/tape.png',
    our: '../../static/icons/our.png',
    iphone: '../../static/icons/iphone.png',
    safe: '../../static/icons/safe.png',
    ordering: '../../static/icons/ordering.png',
    iphone_1:'../../static/icons/iphone_1.png',
    qrcode:'../../static/icons/qrcode.png',
    time:'获取验证码',
    currentTime:61,
    disable:false,
    code: '',
    phone: '',
    user: '',
    demand: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //获取表单数据
  linkInput:function(e){
    this.setData({
      user: e.detail.value
    })
  },
  iphoneInput:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  codeInput:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  demandInput:function(e){
    this.setData({
      demand: e.detail.value
    })
  },

  //验证码倒计时
  getCode:function(){
    var that = this
    var currentTime = that.data.currentTime
    if(that.data.disable) return
    that.setData({
      disable:true
    })
    var interval = setInterval(function(){
      currentTime--
      that.setData({
        time:currentTime+'秒'
      })
      if(currentTime <= 0){
        clearInterval(interval)
        that.setData({
          time:'重新发送',
          currentTime:61,
          disable:false
        })
      }
    },1000)
  },
  
  //获取验证码
  getVerificationCode:function(){
    this.getCode()
    var that = this
    Api.messageCode({
      phone: that.data.phone
    }).then(res => {
      console.log(res)
    })
  },

  //提交摄影预约
  submitOrder:function(){
    Api.orderShot({
      code:this.data.code,
      user:this.data.user,
      phone:this.data.phone,
      demand:this.data.demand
    }).then(res => {
      console.log(res)
      if(res.code == 200){
        wx.showToast({
          title: '您已成功预约',
          icon: 'succest'
        })
      }
      if (res.code == 500) {
        wx.showToast({
          title: '验证码错误，请重新输入',
          icon: 'none'
        })
      }
    })
  }
})