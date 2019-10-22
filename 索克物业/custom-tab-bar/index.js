Component({
  data: {
    selected: 0,
    color: "#323232",
    selectedColor: "#68d6ab",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "/images/main1.png",
      selectedIconPath: "/images/main1_select.png",
      text: "首页"
    }, {
      pagePath: "/pages/userCenter/userCenter",
      iconPath: "/images/main2.png",
      selectedIconPath: "/images/main2_select.png",
      text: "我的"
    }]
  },
  attached() {},
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      console.log("index==="+data.index)
      if (this.data.selected != data.index)
      {
      this.setData({
        selected: data.index
      })
      setTimeout(function(){
        wx.switchTab({
          url
        })
      },100)
      }

    }
  }
})