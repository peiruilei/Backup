//index.js
//获取应用实例
const app = getApp()
import *as Api from '../../http/api.js'
Page({
  data: {
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navigate: [],
    waitImg: '../../static/icons/jinru.png',
    noImg: '../../static/icons/noImg.png',
    arrowImg: '../../static/icons/arrow.png',
    list:[],
    index:1,
    activityId:0,
    pageNum:1,
    pageSize:10,
    noAlbum:false,
    loading:true,
    noData:false
  },
  onLoad: function () {
    wx.hideTabBar()
    this.getNavigateList()
    this.getAlbumList()

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 上拉刷新
  onPullDownRefresh: function () {
    this.setData({
      pageNum:1,
      list:[],
      noAlbum: false,
      loading: true,
      noData: false
    })
    this.getAlbumList()
  },
  //下拉获取更多数据
  onReachBottom: function () {
    if(this.data.noData) return
    var pageNum = this.data.pageNum + 1
    this.setData({
      pageNum: pageNum
    })
    this.getAlbumList()
  },

  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  // 导航栏切换
  changeNavigate: function(e){
    this.setData({
      activityId: e.currentTarget.dataset.id,
      pageNum:1,
      list:[],
      noAlbum:false,
      loading:true,
      noData:false
    })
    this.getAlbumList()
  },

  onShow: function(){
  },

  //获取导航栏活动类型
  getNavigateList:function(){
    var that = this
    Api.navigateList({})
      .then(res =>{
        console.log(res)
        var list = res.result
          that.setData({
            navigate:list
          })
      })
  },

  //获取相册列表数据
  getAlbumList:function(){
    var that = this
    console.log(this.data.pageNum)
    Api.selectAlbumList({
      activityId:that.data.activityId,
      pageNum:that.data.pageNum,
      pageSize:that.data.pageSize
    }).then(res =>{
      console.log(res)
      if (res.result.list.length == 0){
        if(that.data.pageNum == 1){
          that.setData({
            noAlbum: true,
            loading: false
          })
          return
        }else{
          that.setData({
            noData:true
          })
          return
        }
      }
      var list = that.data.list.concat(res.result.list)
      that.setData({
        list: list,
        loading:false
      })
    })
  },
})
