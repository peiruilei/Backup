// pages/productDetail/productDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topImg:'../../static/WOA0EWC9HM@2x.png',
    productName:'炭火烤肉（路劲大厦店）店家代金券 指定商家代金券 炭火烤肉（路劲大厦店）店家代金券 指定商家代金券',
    postage: '￥10.00',
    currentPrice:'100积分+10.00元',
    originalPrice:'100.00元',
    productDetailContent:'炭火烤肉（路劲大厦店）店家代金劵 指定商家代金劵 炭火烤肉（路劲大厦店）店家代金劵 指定商家代金劵',
    index:'1',
    bottomDisable:false
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

  checkNavigaet:function(e){
    var id = e.currentTarget.dataset.id
    this.setData({
      index: id
    })
  },

  bottomDisable:function(){
    if(this.data.disable){
      this.setData({
        disable:false
      })
    }else{
      this.setData({
        disable: true
      })
    }
  }
})