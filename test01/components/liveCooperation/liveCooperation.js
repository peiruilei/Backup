// components/liveCooperation/liveCooperation.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  lifetimes: {
    attached: function () {
      
    },
    detached: function () {

    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    bg: '../../static/icons/bj.png',
    tape: '../../static/icons/tape.png',
    our: '../../static/icons/our.png',
    iphone: '../../static/icons/iphone.png',
    safe: '../../static/icons/safe.png',
    ordering: '../../static/icons/ordering.png',
    iphone_1: '../../static/icons/iphone_1.png',
    qrcode: '../../static/icons/qrcode.png',
    time: '获取验证码',
    currentTime: 61,
    disable: false,
    code: '',
    phone: '',
    user: '',
    demand: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //获取表单数据
    linkInput: function (e) {
      this.setData({
        user: e.detail.value
      })
    },
    iphoneInput: function (e) {
      this.setData({
        phone: e.detail.value
      })
    },
    codeInput: function (e) {
      this.setData({
        code: e.detail.value
      })
    },
    demandInput: function (e) {
      this.setData({
        demand: e.detail.value
      })
    },

    //验证码倒计时
    getCode: function () {
      var that = this
      var currentTime = that.data.currentTime
      if (that.data.disable) return
      that.setData({
        disable: true
      })
      var interval = setInterval(function () {
        currentTime--
        that.setData({
          time: currentTime + '秒'
        })
        if (currentTime <= 0) {
          clearInterval(interval)
          that.setData({
            time: '重新发送',
            currentTime: 61,
            disable: false
          })
        }
      }, 1000)
    },

    //获取验证码
    getVerificationCode: function () {
      this.getCode()
      var that = this
      Api.messageCode({
        phone: that.data.phone
      }).then(res => {
        console.log(res)
      })
    },

    //提交摄影预约
    submitOrder: function () {
      Api.orderShot({
        code: this.data.code,
        user: this.data.user,
        phone: this.data.phone,
        demand: this.data.demand
      }).then(res => {
        console.log(res)
        if (res.code == 200) {
          wx.showToast({
            title: '您已成功预约',
            icon: 'succest'
          })
        }
        if (res.code == 500) {
          wx.showToast({
            title: '验证码错误，请重新输入',
            icon: 'none'
          })
        }
      })
    }
  }
})
