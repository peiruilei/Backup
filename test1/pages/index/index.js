// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pencilImg:'../../static/pencil.png',
    icon:'../../static/icon.png',
    inputAdr:'请填写您的收货地址！',
    testCheck:1,
    address: '众意西路路劲大厦1617',
    name: '赵乐',
    phone: '130 3376 0661',
    shopName:'炭火烤肉（路劲大厦店）',
    order: ['a', 'b'],
    otherPrice: [{ img: '', name: '包装费', price: '￥0', color:'#7387FF', font:'包'}, 
      { img: '', name: '配送费', price: '￥0', color: '#32E137', font: '配'}, 
      { img: '', name: '奖励金', price: '￥26', color: '#FF3C3C', font: '奖'}],
    arrow:'../../static/arrow.png',
    cover:false,
    hook: '../../static/hook.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var i = this.data.order.length
    var height = i * 168 - 40
    this.setData({
      height: height
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

  testCheck:function(){
    if(this.data.testCheck==0){
      this.setData({
        testCheck: 1
      })
    }else{
      this.setData({
        testCheck: 0
      })
    }
  },

  testTap:function(){
    var that = this
    this.setData({
      cover:true
    })
    setTimeout(function(){
      that.setData({
        cover: false
      })
    },5000)
  }
})