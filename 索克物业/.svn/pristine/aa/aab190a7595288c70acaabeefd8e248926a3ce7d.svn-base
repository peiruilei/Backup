// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#323232",
        "selectedColor": "#68d6ab",
        "list": [
          {
            "pagePath": "/pages/index/index",
            "iconPath": "icon/main1.png",
            "selectedIconPath": "icon/main1_select.png",
            "text": "首页"
          },
          {
            "pagePath": "/pages/userCenter/userCenter",
            "iconPath": "icon/main2.png",
            "selectedIconPath": "icon/main2_select.png",
            "text": "个人中心"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: app.globalData.systemInfo == "iPhone X" ? true : false,
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
