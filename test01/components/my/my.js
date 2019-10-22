// components/my/my.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  lifetimes: {
    attached: function () {
      wx.setNavigationBarTitle({
        title: '我的',
      })
    },
    detached: function () {
      wx.setNavigationBarTitle({
        title: '5G云摄影',
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [{ img: '../../static/icons/browse.png', title: '我浏览过的相册', bindtap: 'toHistoryAlbum' },
    { img: '../../static/icons/collection.png', title: '我收藏的照片', bindtap: 'toCollectedPhoto' }],
    arrow: '../../static/icons/arrow.png',
    index: 3
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //进入浏览相册页
    toHistoryAlbum: function () {
      wx.navigateTo({
        url: '../../pages/index/historyAlbum/historyAlbum',
      })
    },

    //进入收藏照片页
    toCollectedPhoto: function () {
      wx.navigateTo({
        url: '../../pages/index/collectedPhoto/collectedPhoto',
      })
    }
  }
})
