// pages/userCenter/userCenter.js
const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../utils/HHEncryptUtils.js')
var modelUtils = require('../../utils/HHModelUtils.js')
var utils = require('../../utils/util.js')
var user_id = ''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userCenter_top_bg: imagePath + app.globalData.userCenter_top_bg,
    userCenter_headimg: imagePath + app.globalData.userCenter_headimg,
    userCenter_apply: imagePath + app.globalData.userCenter_apply,
    userCenter_setting: imagePath + app.globalData.userCenter_setting,
    content_back: imagePath + app.globalData.content_back,
    userService_list_general: [{
        service_name: '关注收藏',
      service_img: imagePath + app.globalData.userCenter_attention,
        service_id: 1
      },
      {
        service_name: '两金一分',
        service_img: imagePath + app.globalData.userCenter_twogold,
        service_id: 2
      },
      {
        service_name: '',
        service_img: '',
        service_id: 0
      },
      {
        service_name: '',
        service_img: '',
        service_id: 0
      }
    ],
    ortherService_list_general: [{
        orther_service_name: '购物车',
        orther_service_img: imagePath + app.globalData.userCenter_shoppingcart,
        orther_service_id: 1
      },
      {
        orther_service_name: '收货地址',
        orther_service_img: imagePath + app.globalData.userCenter_address,
        orther_service_id: 2
      },
      {
        orther_service_name: '系统消息',
        orther_service_img: imagePath + app.globalData.userCenter_message,
        orther_service_id: 3
      },
      {
        orther_service_name: '券包仓库',
        orther_service_img: imagePath + app.globalData.userCenter_Voucher_warehouse,
        orther_service_id: 4
      },
      {
        orther_service_name: '免费活动',
        orther_service_img: imagePath + app.globalData.userCenter_Free_event,
        orther_service_id: 5
      },
      {
        orther_service_name: '意见反馈',
        orther_service_img: imagePath + app.globalData.userCenter_think,
        orther_service_id: 6
      },
      {
        orther_service_name: '联系客服',
        orther_service_img: imagePath + app.globalData.userCenter_contact,
        orther_service_id: 7
      },
      {
        orther_service_name: '设置',
        orther_service_img: imagePath + app.globalData.userCenter_settingLight,
        orther_service_id: 8
      },
      {
        orther_service_name: '券包核销',
        orther_service_img: imagePath + app.globalData.userCenter_Voucher,
        orther_service_id: 9
      },

    ],
    ortherService_list_proxy: [{
      orther_service_name: '购物车',
      orther_service_img: imagePath + app.globalData.userCenter_shoppingcart,
      orther_service_id: 1
    },
    {
      orther_service_name: '收货地址',
      orther_service_img: imagePath + app.globalData.userCenter_address,
      orther_service_id: 2
    },
    {
      orther_service_name: '系统消息',
      orther_service_img: imagePath + app.globalData.userCenter_message,
      orther_service_id: 3
    },
    {
      orther_service_name: '券包仓库',
      orther_service_img: imagePath + app.globalData.userCenter_Voucher_warehouse,
      orther_service_id: 4
    },
    {
      orther_service_name: '免费活动',
      orther_service_img: imagePath + app.globalData.userCenter_Free_event,
      orther_service_id: 5
    },
    {
      orther_service_name: '意见反馈',
      orther_service_img: imagePath + app.globalData.userCenter_think,
      orther_service_id: 6
    },
    {
      orther_service_name: '联系客服',
      orther_service_img: imagePath + app.globalData.userCenter_contact,
      orther_service_id: 7
    },
    ],
    myShopping_list_proxy: [{
      myShopping_name: '店铺信息',
      myShopping_img: imagePath + app.globalData.userCenter_shopInfo,
      myShopping_id: 1
    },
    {
      myShopping_name: '客户反馈',
      myShopping_img: imagePath + app.globalData.userCenter_client,
      myShopping_id: 2
    },
      {
        myShopping_name: '券包核销',
        myShopping_img: imagePath + app.globalData.userCenter_voucher_package,
       myShopping_id: 3
      },
    
    ],
    userService_list_proxy: [{
        service_name: '关注收藏',
      service_img: imagePath + app.globalData.userCenter_attention,
        service_id: 1
      },
      {
        service_name: '两金一分',
        service_img: imagePath + app.globalData.userCenter_twogold,
        service_id: 2
      },
      {
        service_name: '会员管理',
        service_img: imagePath + app.globalData.userCenter_VIP,
        service_id: 3
      },
      {
        service_name: '代理中心',
        service_img: imagePath + app.globalData.userCenter_proxy,
        service_id: 4
      }
    ],
    userInfo:{},
    isUser:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    user_id = wx.getStorageSync("user_id")
    if (user_id) {
      that.setData({
        isUser: true
      })
      this.getUserData()
    }  
  },
  //设置
  onSetting(){
    if (!this.data.isUser) {
      this.toLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/userCenter/setting/setting',
    })
  },
  //申请商铺
  onApplyShopping() {
    if (!this.data.isUser) {
      this.toLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/userCenter/applyShops/applyShops',
    })
  },
  //个人资料
  onuserInfo(){
    if (!this.data.isUser) {
      this.toLogin()
      return
    }
    wx.navigateTo({
      url: '/pages/userCenter/userInfo/userInfo',
    })
  },
  //我的服务
  onUserService(e) {
    if (!this.data.isUser) {
      this.toLogin()
      return
    }
    //1.关注收藏；2.两金一分；3.会员管理；4.代理中心
    switch (e.currentTarget.dataset.service_id) {
      case 1:
        wx.navigateTo({
          url: '/pages/userCenter/myCollection/myCollection',
        })
        break;
      case 2:
        wx.navigateTo({
          url: "/pages/userCenter/userAmount/userAmount",
        })
        break;
      case 3:
        wx.navigateTo({
          url: "/pages/userCenter/vipManage/vipManage",
        })
        break;
      case 4:
        wx.navigateTo({
          url: "/pages/userCenter/agencyCenter/agencyCenter",
        })
        break;
      default:
        break;
    }
  },
  // 其他服务
  onOrtherService(e) {
    if (!this.data.isUser) {
      this.toLogin()
      return
    }
    //1.购物车；2.收获地址；3.系统消息；4.券包仓库；5.免费活动；6.意见反馈；8.设置；9.券包核销；
    switch (e.currentTarget.dataset.orther_service_id) {
      case 1:
        wx.navigateTo({
          url: '/pages/userCenter/shoppingCart/shoppingCart',
        })
        break;
      case 2:
        wx.navigateTo({
          url: "/pages/userCenter/address/address",
        })
        break;
      case 3:
        wx.navigateTo({
          url: '/pages/userCenter/systemMessage/systemMessage',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '/pages/userCenter/voucherWarehouse/voucherWarehouse',
        })
        break;
      case 5:
        wx.navigateTo({
          url: '/pages/userCenter/freeEvent/freeEvent',
        })
        break;
      case 6:
        wx.navigateTo({
          url: '/pages/userCenter/feedBack/feedBack',
        })
        break;
      case 8:
        wx.navigateTo({
          url: '/pages/userCenter/setting/setting',
        })
        break;
      case 9:
        wx.navigateTo({
          url: '/pages/index/writeOff/writeOffList/writeOffList',
        })
        break;
        default:
        break;
    }
  },
  // 我的店铺
  onMyShopping(e){
    if (!this.data.isUser) {
      this.toLogin()
      return
    }
    //1.店铺信息；2.客户反馈；3.券包核销；
    switch (e.currentTarget.dataset.myshopping_id) {
      case 1:
        wx.navigateTo({
          url: '/pages/userCenter/shopInformation/shopInformation',
        })
        break;
      case 2:
        wx.navigateTo({
          url: '',
        })
        break;
      case 3:
        wx.navigateTo({
          url: "/pages/index/writeOff/writeOffList/writeOffList",
        })
        break;
      default:
        break;
    }
  },
  getUserData: function () {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        })
      }
    }
    var that = this
    var para = {}
    para["user_id"] = encryptUtils.base64Encode(user_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "usercenter",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          var needData = res.data.result
          var user_info = modelUtils.getModel(needData)
          console.log(user_info)
          that.setData({
            userInfo: user_info
          })
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      },
      complete: function () {
        wx.stopPullDownRefresh()
      }
    })
  },
  // 去登录
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login/userLogin',
    })
  }

})