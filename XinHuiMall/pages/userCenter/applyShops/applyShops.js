// pages/userCenter/applyShops/applyShops.js

const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    content_back: imagePath + app.globalData.content_back,
    login_protocol_unselect: imagePath + app.globalData.login_protocol_unselect,
    login_protocol_select: imagePath + app.globalData.login_protocol_select,
    common_upload_img: imagePath + app.globalData.common_upload_img,
    shop_class_list: [],
    shop_class_id: "",
    shopTypeName: "",
    is_select: true,
    shops_name: "",
    phone_num: "", //手机号码
    owner_name: "", //姓名
    big_img: "",
    address: "", //详情地址
    longitude: "", //店铺经度
    latitude: "", //,店铺纬度
    addressSrc: "", ////地址
    city_id: 0, //城市ID
    shopLogoImgFile: "",
    shopLogoImgFilePath: "",
    receipt_address: "", //选择地址
    audit_state: -1, //-1未申请 0：待审核，1：审核通过 2：审核未通过
    unpass_reason: "",
    isCanEdit: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getShopClassList()
    this.applyShopDetail()
  },

  applyShopDetail: function() {
    wx.showLoading({
      title: '请稍等...',
      mask: true
    })
    var that = this
    var para = {}
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"));
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "applyshopdetail",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          var needData = res.data.result
          var result = modelUtils.getModel(needData)
          that.setData({
            shops_name: result.shop_name,
            shopTypeName: result.shop_class_name,
            shop_class_id:result.shop_class_id,
            addressSrc: result.province_name + result.city_name,
            city_id: result.city_id,
            big_img: result.big_img,
            phone_num: result.phone_num,
            owner_name: result.owner_name,
            audit_state: result.audit_state,
            unpass_reason: result.unpass_reason,
            latitude: result.latitude,
            longitude: result.longitude,
            address: result.address,
            isCanEdit: result.audit_state == 2?true:false
          })
        } else {

        }
      },
      fail: function(res) {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      },
      complete: function() {

      }
    })
  },

  getShopClassList: function() {
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log("urlStr==" + urlStr)
    wx.request({
      url: app.globalData.ip + "shopclasslist",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          var needData = res.data.result
          var result = modelUtils.getList(needData)
          that.setData({
            shop_class_list: result
          })
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function(res) {
        if (wx.hideLoading) {
          wx.hideLoading()
        }
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      },
      complete: function() {
        wx.stopPullDownRefresh()
      }
    })
  },


  uploadDIY: function() {
    var that = this
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在提交',
        mask: true
      })
    }
    var para = {}
    para["source_type"] = encryptUtils.base64Encode(1);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.uploadFile({
      url: app.globalData.ip + "useruploadimg",
      filePath: that.data.shopLogoImgFile,
      name: 'fileData',
      formData: {
        'para': urlStr
      },
      header: {
        'From': "WeChat",
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        var resValue = JSON.parse(res.data)
        var code = resValue.code;
        var msg = resValue.msg;
        var result = modelUtils.getModel(resValue.result)

        if (code == 100) {
          that.setData({
            shopLogoImgFilePath: result.source_img
          })
          that.editShopInfo()
        } else {
          wx.showToast({
            title: msg,
            icon: 'none'
          })
        }

      },
      fail: (res) => {
        wx.showToast({
          title: "文件上传失败",
          icon: 'none'
        })
      },
      complete: () => {},
    });
  },
  //申请店铺
  editShopInfo: function() {
    var that = this
    var para = {}

    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"));
    para["owner_name"] = encryptUtils.base64Encode(that.data.owner_name);
    para["phone_num"] = encryptUtils.base64Encode(that.data.phone_num) //类型：1：第一次实名认证，2：修改实名认证信息
    para["city_id"] = encryptUtils.base64Encode(that.data.city_id)
    para["address"] = encryptUtils.base64Encode(that.data.address)
    para["latitude"] = encryptUtils.base64Encode(that.data.latitude)
    para["shop_name"] = encryptUtils.base64Encode(that.data.shops_name)
    para["shop_class_id"] = encryptUtils.base64Encode(that.data.shop_class_id)
    para["longitude"] = encryptUtils.base64Encode(that.data.longitude)
    para["big_img"] = encryptUtils.base64Encode(that.data.shopLogoImgFilePath.length > 0 ? that.data.shopLogoImgFilePath:that.data.big_img)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    var that = this
    wx.request({
      url: app.globalData.ip + "editshopinfo",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100 || code == 103) {
          wx.showToast({
            title: msg,
            icon: 'none',
          })

          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            })
          }, 1500)
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function(res) {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      },
      complete: function() {
        wx.stopPullDownRefresh()
      }
    })
  },


  // 提交
  sumitPressed: function() {
    var shopName = this.data.shops_name
    var shopTypeName = this.data.shopTypeName
    var latitude = this.data.latitude
    var city_id = this.data.city_id
    var address = this.data.address
    var bigImg = this.data.big_img
    var shopLogoImgFile = this.data.shopLogoImgFile
    var name = this.data.owner_name
    var phoneNum = this.data.phone_num
    var isSelect = this.data.is_select
    if (shopName.length == 0) {
      wx.showToast({
        title: '请输入店铺名称',
        icon: "none"
      })
      return
    }

    if (shopTypeName.length == 0) {
      wx.showToast({
        title: '请选择店铺类型',
        icon: "none"
      })
      return
    }

    if (latitude.length == 0) {
      wx.showToast({
        title: '请选择店铺位置',
        icon: "none"
      })
      return
    }

    if (city_id == 0) {
      wx.showToast({
        title: '请选择所在省市',
        icon: "none"
      })
      return
    }

    if (address.length == 0) {
      wx.showToast({
        title: '请输入详细地址',
        icon: "none"
      })
      return
    }

    if (bigImg.length > 0) {

    } else {
      if (shopLogoImgFile.length == 0) {
        wx.showToast({
          title: '请选择店铺LOGO',
          icon: "none"
        })
        return
      }
    }

    if (name.length == 0) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: "none"
      })
      return
    }

    if (phoneNum.length == 0) {
      wx.showToast({
        title: '请输入手机号',
        icon: "none"
      })
      return
    }

    if (isSelect) {

    } else {
      wx.showToast({
        title: '请勾选《昕惠商城平台店铺条例规范》',
        icon: "none"
      })
      return
    }

    if (shopLogoImgFile.length > 0) {
      this.uploadDIY()
    } else {
      this.editShopInfo()
    }

  },


  //店铺名称
  inputShopNamePressed: function(event) {
    this.setData({
      shops_name: event.detail.value
    })
  },
  // 详细地址
  inputAddressDetailPressed: function(event) {
    this.setData({
      address: event.detail.value
    })
  },

  // 输入姓名
  inputNamePressed: function(event) {
    this.setData({
      owner_name: event.detail.value
    })
  },
  //手机号
  inputTelPressed: function(event) {
    this.setData({
      phone_num: event.detail.value
    })
  },
  //选择logo
  selectImgPressed: function() {
    if (this.data.isCanEdit) {

    } else {
      return
    }

    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        that.setData({
          shopLogoImgFile: res.tempFilePaths[0]
        })
      },
    })
  },

  // 选择类型
  bindPickerChange: function(event) {
    var index = event.detail.value
    var shopClassList = this.data.shop_class_list
    this.setData({
      shopTypeName: shopClassList[index].shop_class_name,
      shop_class_id: shopClassList[index].shop_class_id
    })
  },

  selectLoginProtocol: function() {
    this.setData({
      is_select: !this.data.is_select,
    })
  },

  goToExplainSettingUrlPressed: function() {
    wx.navigateTo({
      url: '/pages/userCenter/explainSettingUrl/explainSettingUrl?explain_id=' + 4 + "&name=" + "昕慧商城平台店铺条例规范",
    })
  },
  selectCityPressed() {
    if (this.data.isCanEdit) {

    } else {
      return
    }

    wx.navigateTo({
      url: '/pages/userCenter/address/selectCity/selectCity?mark=1',
    })
  },
  selectShopAddress() {
    if (this.data.isCanEdit) {

    } else {
      return
    }
    wx.navigateTo({
      url: '/pages/userCenter/applyShops/mapSelectAddress/mapSelectAddress',
    })
  },
})