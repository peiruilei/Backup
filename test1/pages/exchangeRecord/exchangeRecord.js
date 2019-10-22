// pages/exchangeRecord/exchangeRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:'1',
    recordList:[{name:'指定商家代金券',state:'兑换成功', img:'', time:'2019-10-10 14:18:42', price:'100积分+10.00元'},
      { name: '指定商家代金券', state: '兑换成功', img: '', time: '2019-10-10 14:18:42', price: '100积分+10.00元'},
      { name: '指定商家代金券', state: '兑换成功', img: '', time: '2019-10-10 14:18:42', price: '100积分+10.00元'},
      { name: '指定商家代金券', state: '兑换成功', img: '', time: '2019-10-10 14:18:42', price: '100积分+10.00元' }],
    noRecord:false
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

  checkNavigaet: function (e) {
    var id = e.currentTarget.dataset.id
    this.setData({
      index: id
    })
  
    if(id=='1'){
      this.setData({
        noRecord:false
      })
    }else{
      this.setData({
        noRecord: true
      })
    }
  },
})