// components/wonderfulCase/wonderfulCase.js
const app = getApp()
import *as Api from '../../http/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  // 组件生命周期
  lifetimes: {
    attached:function(){
      this.getNavigateList()
      this.getAlbumList()
    },
    detached:function(){

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    navigate: [],
    waitImg: '../../static/icons/jinru.png',
    noImg: '../../static/icons/noImg.png',
    arrowImg: '../../static/icons/arrow.png',
    list: [],
    activityId: 0,
    pageNum: 1,
    pageSize: 10,
    noAlbum: false,
    loading: true,
    noData: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 导航栏切换
    changeNavigate: function (e) {
      this.setData({
        activityId: e.currentTarget.dataset.id,
        pageNum: 1,
        list: [],
        noAlbum: false,
        loading: true,
        noData: false
      })
      this.getAlbumList()
    },

    onShow: function () {
    },

    //获取导航栏活动类型
    getNavigateList: function () {
      var that = this
      Api.navigateList({})
        .then(res => {
          console.log(res)
          var list = res.result
          that.setData({
            navigate: list
          })
        })
    },

    //获取相册列表数据
    getAlbumList: function () {
      var that = this
      console.log(this.data.pageNum)
      Api.selectAlbumList({
        activityId: that.data.activityId,
        pageNum: that.data.pageNum,
        pageSize: that.data.pageSize
      }).then(res => {
        console.log(res)
        if (res.result.list.length == 0) {
          if (that.data.pageNum == 1) {
            that.setData({
              noAlbum: true,
              loading: false
            })
            return
          } else {
            that.setData({
              noData: true
            })
            return
          }
        }
        var list = that.data.list.concat(res.result.list)
        that.setData({
          list: list,
          loading: false
        })
      })
    },

    scrolltolower:function(){
      console.log('scroll-view触底')
      if (this.data.noData) return
      var pageNum = this.data.pageNum + 1
      this.setData({
        pageNum: pageNum
      })
      this.getAlbumList()
    }
  }
})
