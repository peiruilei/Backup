// pages/wantEnter/wantEnter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buycarIcon:'../../static/icon2x.png',
    enterStyleList: [{ icon: '../../static/friend2x.png', color: '#32AFF0', enterStyle:'朋友推荐',state:false},
      { icon: '../../static/integralMall2x.png', color: '#FF9B55', enterStyle: '体验过购免单会员店', state: false },
      { icon: '../../static/weibo2x.png', color: '#F0D732', enterStyle: '微博', state: false },
      { icon: '../../static/wx2x.png', color: '#55CD37', enterStyle: '公众号', state: false },
      { icon: '../../static/douyin2x.png', color: '#32373C', enterStyle: '抖音', state: false },
      { icon: '../../static/recommend2x.png', color: '#FF3C3C', enterStyle: '商家推荐', state: false },
      { icon: '../../static/other2x.png', color: '#999999', enterStyle: '其他', state: false },],
    checked:0
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

  checked:function(e){
    var index = e.currentTarget.dataset.id
    var that = this
    if(!this.data.enterStyleList[index].state){
      var num = that.data.checked + 1
      var key = 'enterStyleList[' + index + '].state'
      that.setData({
        checked:num,
        [key]: true
      })
    }else{
      var num = that.data.checked - 1
      var key = 'enterStyleList[' + index + '].state'
      that.setData({
        checked: num,
        [key]: false
      })
    }
  }
})