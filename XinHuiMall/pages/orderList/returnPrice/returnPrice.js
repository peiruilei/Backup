const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var http = require('../../userCenter/shoppingCart/http.js')
var completeCount = 0 //图片上传成功数量
Page({
  data: {
    apply_return_price_icon: imagePath + app.globalData.apply_return_price_icon,
    content_back: imagePath + app.globalData.content_back,
    type_array:['退款','退货','换货'],
    mark:0,
    type_name:'请选择',
    phone_number:0,
    service_message:'',
    order_id:0,
    feedback_img_str: "",
    FeedbackImgList: [],
  },
  onLoad: function (options) {
    var order_id = options.order_id
    this.setData({
      order_id:order_id
    })
    if (options.mark){
      this.setData({
        mark_type: options.mark
      })
      if (options.mark == 1) {
        wx.setNavigationBarTitle({
          title: '申请售后',
        })
      }
    }
  },
  onShow: function () {
  completeCount = 0 //图片上传成功数量
  },
  // 选择售后类型
  bindPickerChange(e){
var index = e.detail.value
this.setData({
  type_name:this.data.type_array[index],
  mark:index+1
})
  },
  //手机号
  onTelPhoneBlur(e){
    this.setData({
      phone_number:e.detail.value
    })
  },
  //售后说明
  onMessageBlur(e) {
    this.setData({
      service_message: e.detail.value
    })
  },
  //提交
  onBTsubmit(){
    var that = this
    var phone_number = this.data.phone_number
    var service_message = this.data.service_message
    var type_name = this.data.type_name
    console.log(phone_number, service_message, type_name)
    if (!type_name){
      wx.showToast({
        title: '请选择售后类型',
        icon:'none'
      })
      return
    }
    if (!phone_number) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    if (phone_number.length != 11 || phone_number==11111111111 ) {
    // if (phone_number.length != 11) {
      wx.showToast({
        title: '手机号码格式不正确',
        icon: 'none'
      })
      return
    }
    if (!service_message) {
      wx.showToast({
        title: '请输入申请说明',
        icon: 'none'
      })
      return
    }
    // if (that.data.mark_type) {
    //   if (that.data.mark_type == 1) {
    //     if (that.data.mark == 1) {
    //       wx.showToast({
    //         title: '请选择退货/换货',
    //         icon: 'none'
    //       })
    //       return
    //     }
    //   }
    //   if (that.data.mark_type == 0) {
    //     if (that.data.mark > 1) {
    //       wx.showToast({
    //         title: '请选择退款',
    //         icon: 'none'
    //       })
    //       return
    //     }
    //   }
    // }
    var FeedbackImgList = that.data.FeedbackImgList
    if (FeedbackImgList.length > 0) {
      that.uploadDIY(FeedbackImgList, 0, 0, 0, FeedbackImgList.length)
    } else {
      that.editApplyService()
    }
  },
  // 选择图片
  getImg: function (event) {
    var that = this
    var state = event.currentTarget.dataset.state //1:原有图片的删除或查看大图  2：添加图片
    var FeedbackImgList = that.data.FeedbackImgList //图片列表
    if (state == 1) {
      var index = event.currentTarget.dataset.index
      wx.showActionSheet({
        itemList: ["大图预览", "删除"],
        success: function (res) {
          var position = res.tapIndex//用户点击按钮的序号从0开始
          if (position == 0) {
            var urls = []
            var current = FeedbackImgList[index].img
            for (var i = 0; i < FeedbackImgList.length; i++) {
              urls[i] = FeedbackImgList[i].img
            }
            wx.previewImage({
              current: current, // 当前显示图片的http链接
              urls: urls // 需要预览的图片http链接列表
            })
          } else if (position == 1) {
            FeedbackImgList.splice(parseInt(index), 1)
            that.setData({
              FeedbackImgList: FeedbackImgList
            })
          }
        }
      })
    } else {
      wx.chooseImage({
        count: 6 - FeedbackImgList.length, //选择图片个数 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          var tempFilePaths = res.tempFilePaths
          for (var i = 0; i < tempFilePaths.length; i++) {
            var item = {}
            item["img"] = tempFilePaths[i]
            FeedbackImgList.splice(0, 0, item)//添加图片
          }
          console.log(FeedbackImgList)
          that.setData({
            FeedbackImgList: FeedbackImgList
          })
        }
      })
    }

  },
  uploadDIY(FeedbackImgList, successUp, failUp, i, length) {
    var that = this
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在提交...',
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
      filePath: FeedbackImgList[i].img,//从本地上传的路径
      name: 'fileData',
      formData: {
        'para': urlStr
      },
      header: {
        'From': "WeChat",
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        successUp++;
        var resValue = JSON.parse(res.data)
        var code = resValue.code
        var result = modelUtils.getModel(resValue.result)


        if (code == 100) {
          // 图片拼接--->缩略图,大图,原图|缩略图,大图,原图|缩略图,大图,原图【同一图片以 , 拼接，不同图片以|拼接】
          var feedbackImgStr = that.data.feedback_img_str
          if (feedbackImgStr.length == 0) {
            feedbackImgStr = result.thumb_img + ',' + result.big_img + ',' + result.source_img
          } else {
            feedbackImgStr = feedbackImgStr + '^' + result.thumb_img + ',' + result.big_img + ',' + result.source_img
          }
          that.setData({
            feedback_img_str: feedbackImgStr
          })

        } else {

        }
      },
      fail: (res) => {
        failUp++;
      },
      complete: () => {
        i++;
        completeCount++;
        var imgCount = FeedbackImgList.length
        if (completeCount == imgCount) {
          that.editApplyService()
        } else {
          if (i == length) { } else { //递归调用uploadDIY函数
            this.uploadDIY(FeedbackImgList, successUp, failUp, i, length);
          }
        }
      },
    });
  },
  editApplyService(){
    var that = this
    var data = {
      v: app.globalData.v,
      order_id: that.data.order_id,
      user_id: wx.getStorageSync('user_id'),
      apply_reason: that.data.type_name,
      apply_explain: that.data.service_message,
      tel: that.data.phone_number,
      apply_img_str: that.data.feedback_img_str,
      refund_type:that.data.mark
    }
    console.log(data)
    http.postReq('addorderapplyrefund', data, function (res) {
      console.log(res)
      var code = res.code
      var msg = res.msg
      if (code == 100) {
        wx.showToast({
          title: msg,
          icon: 'success',
          duration: 2000
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 2
          })
        }, 2000)
      } else {
        wx.showToast({
          title: msg,
          icon: 'none',
        })
      }
    })
  }
})