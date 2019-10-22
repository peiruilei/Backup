// pages/TarBar/tarbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    currentindex:Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    case:'../../static/icons/case.png',
    live:'../../static/icons/live.png',
    my:'../../static/icons/my.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //跳转到直播合作页
    toOrderShot:function(){
      wx.navigateTo({
        url: '/pages/ordershot/ordershot',
      })
    },
    //跳转到我的页面
    toMy:function(){
      if (this.properties.currentindex == 3) return
      wx.redirectTo({
        url: '/pages/my/my',
      })
    },
    //跳转到精选案例页
    toIndex:function(){
      if (this.properties.currentindex==1) return
      wx.redirectTo({
        url: '/pages/index/index',
      })
    }
  }
})
