const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../utils/HHModelUtils.js')
var utils = require('../../../utils/util.js')
var countDown = 120;
var timer;
var completeCount = 0 //图片上传成功数量

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index_arrow: imagePath + app.globalData.index_arrow,
    task_add_img: imagePath + app.globalData.task_add_img,
    task_agree_tips: imagePath + app.globalData.task_agree_tips,
    task_no_agree_tips: imagePath + app.globalData.task_no_agree_tips,
    taskTypeID: 0,//任务id
    taskTypeName: '请选择任务类型',//任务名字
    taskPrice: 0,
    verify_code: "获取验证码",
    get_code: "true",
    contactTel:'',
    villageID: 0,
    villageName: '请选择小区',
    taskImgList:[],//任务图集
    task_img_str:'',
    serviceFees:0,//服务费
    isHaveServiceFees:false,//是否有服务费【0：否 1：是】
    isAgreeTips:false,//是否同意协议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    countDown = 120;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
// 类型
  taskTypeList: function () {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    wx.navigateTo({
      url: '/pages/task/taskTypeList/taskTypeList',
    })
  },
  //选择小区
  villageClick: function () {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    wx.navigateTo({
      url: '/pages/villageList/villageList',
    })
  },
  //获取电话号码
  getPhoneNum: function (event){
    var contactTel=event.detail.value;
    this.setData({
      contactTel: contactTel
    })

  },
  //选择协议
  selectTips:function(){
    var isAgreeTips = this.data.isAgreeTips;
    this.setData({
      isAgreeTips: !isAgreeTips
    })
  },
  //工程发布协议
  explainSettingClick: function () {
    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime
    wx.navigateTo({
      url: '/pages/userCenter/explainSettingUrl/explainSettingUrl?explain_id=6',
    })
  },
  // 选择头像
  getImg: function (event) {
    var that = this
    var state = event.currentTarget.dataset.state  //1:原有图片的删除或查看大图  2：添加图片
    var taskImgList = that.data.taskImgList   //图片列表
    if (state == 1) {
      var index = event.currentTarget.dataset.index
      wx.showActionSheet({
        itemList: ["大图预览", "删除"],
        success: function (res) {
          var position = res.tapIndex
          if (position == 0) {
            var urls = []
            var current = taskImgList[index].img
            for (var i = 0; i < taskImgList.length; i++) {
              urls[i] = taskImgList[i].img
            }
            wx.previewImage({
              current: current, // 当前显示图片的http链接
              urls: urls // 需要预览的图片http链接列表
            })
          } else if (position == 1) {
            taskImgList.splice(parseInt(index), 1)
            that.setData({
              taskImgList: taskImgList
            })
          }
        }
      })
    } else {
      console.log(" taskImgList.length===" + taskImgList.length)
      wx.chooseImage({
        count: 4 - taskImgList.length, //选择图片个数 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success(res) {
          var tempFilePaths = res.tempFilePaths
          for (var i = 0; i < tempFilePaths.length; i++) {
            var item = {}
            item["img"] = tempFilePaths[i]
            taskImgList.splice(0, 0, item)
          }
          that.setData({
            taskImgList: taskImgList
          })
        }
      })
    }

  },
  uploadDIY(taskImgList, successUp, failUp, i, length, taskTypeID, orderMemo, villageID, addressDetail, contactTel, verifyCode) {
    var that = this
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在提交',
        mask: true
      })
    }
    var para = {}
    para["source_type"] = encryptUtils.base64Encode("1");
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.uploadFile({
      url: app.globalData.ip + "order/useruploadimg",
      filePath: taskImgList[i].img,
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
          // 财力图片拼接--->缩略图,大图,原图|缩略图,大图,原图|缩略图,大图,原图【同一图片以 , 拼接，不同图片以|拼接】
          var feedbackImgStr = that.data.task_img_str
          if (feedbackImgStr.length == 0) {
            feedbackImgStr = result.thumb_img + ',' + result.big_img + ',' + result.source_img
          } else {
            feedbackImgStr = feedbackImgStr + '|' + result.thumb_img + ',' + result.big_img + ',' + result.source_img
          }
          that.setData({
            task_img_str: feedbackImgStr
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
        var imgCount = taskImgList.length
        if (completeCount == imgCount) {
          that.addTask(taskTypeID, orderMemo, villageID, addressDetail, contactTel, verifyCode)
        } else {
          if (i == length) {
          } else { //递归调用uploadDIY函数
            this.uploadDIY(taskImgList, successUp, failUp, i, length, taskTypeID, orderMemo, villageID, addressDetail, contactTel, verifyCode);
          }
        }


      },
    });
  },
  //获取验证码
  getVerifiyCode: function (event) {
    var contactTel = this.data.contactTel
    if (contactTel.length == 0 || !utils.checkPhone(contactTel)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return
    }

    var getCode = this.data.get_code
    if (!getCode) {
      return
    }
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在获取',
        mask: true,
      })
    }
    var para = {}
    para["user_tel"] = encryptUtils.base64Encode(contactTel);
    para["oper_type"] = encryptUtils.base64Encode(0);
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    console.log(str)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "mini.system/getverifycodebyusertel",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        console.log(res)
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: '验证码已发送',
            icon: 'success'
          })
          countDown = 120
          that.verifiyCodeCountDown()
        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      }
    })
  },
  //验证码倒计时
  verifiyCodeCountDown: function () {
    var that = this
    //重置计数器初始值
    if (countDown == 0) {
      that.setData({
        verify_code: "获取验证码",
        get_code: true
      })
      if (timer) {
        clearTimeout(timer)
      }
      countDown = 120;
      return;
    }
    timer = setTimeout(function () {
      that.setData({
        verify_code: countDown + "s",
        get_code: false
      })
      countDown--;
      that.verifiyCodeCountDown();
    }, 1000);

  },
  //发布任务
  formSubmit: function (event){
    completeCount=0;
    this.setData({
      task_img_str:''
    })
    var taskTypeID = this.data.taskTypeID;
    var order_memo = event.detail.value.order_memo;
    var taskImgList = this.data.taskImgList;
    var villageID = this.data.villageID;
    var address_detail = event.detail.value.address_detail;
    var contact_tel = event.detail.value.contact_tel;
    var verify_code = event.detail.value.verify_code;
    if (taskTypeID == 0) {
      wx.showToast({
        title: '请选择任务类型',
        icon: 'none'
      })
      return
    }
    if (order_memo.length == 0) {
      wx.showToast({
        title: '请输入任务描述',
        icon: 'none'
      })
      return
    }
    if (taskImgList.length == 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'none'
      })
      return
    }
    if (villageID == 0) {
      wx.showToast({
        title: '请选择小区',
        icon: 'none'
      })
      return
    }
    if (address_detail.length == 0) {
      wx.showToast({
        title: '请输入地址详情',
        icon: 'none'
      })
      return
    }
    if (contact_tel.length == 0) {
      wx.showToast({
        title: '请输入联系电话',
        icon: 'none'
      })
      return
    }
    if (verify_code.length == 0) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none'
      })
      return
    }
    var isAgreeTips = this.data.isAgreeTips;
    if (!isAgreeTips) {
      wx.showToast({
        title: '请阅读并同意《工程平台发布协议》',
        icon: 'none'
      })
      return
    }
    this.uploadDIY(taskImgList, 0, 0, 0, taskImgList.length, taskTypeID, order_memo, villageID, address_detail, contact_tel, verify_code);
  },
  //发布任务
  addTask: function (taskTypeID, orderMemo, villageID, addressDetail, contactTel, verifyCode){
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在提交...',
        mask: true,
      })
    }
    var that = this
    var para = {}
    var userID = wx.getStorageSync("user_id");
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    para["user_id"] = encryptUtils.base64Encode(userID);
    para["task_type_id"] = encryptUtils.base64Encode(taskTypeID);
    para["order_memo"] = encryptUtils.base64Encode(orderMemo);
    para["village_id"] = encryptUtils.base64Encode(villageID);
    para["address_detail"] = encryptUtils.base64Encode(addressDetail);
    para["contact_tel"] = encryptUtils.base64Encode(contactTel);
    para["verify_code"] = encryptUtils.base64Encode(verifyCode);
    para["img_str"] = encryptUtils.base64Encode(this.data.task_img_str);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.request({
      url: app.globalData.ip + "order/addorder",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        var code = res.data.code
        var message = res.data.msg
        if (code == 100) {
          wx.showToast({
            title: message,
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 1000)
        } else {
          wx.showToast({
            title: message,
            icon: 'none',
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'none',

        })

      },
      complete: function () {
      }
    })
  },
  //修改任务类型和小区
  changeTaskTypeOrVillage:function(){
    var taskTypeID = this.data.taskTypeID;
    var villageID = this.data.villageID
    if(taskTypeID==0)
    {
      return
    }
    if (villageID == 0) {
      return
    }
    this.getServiceFees(taskTypeID, villageID);
  },
  //获取服务费
  getServiceFees: function (taskTypeID, villageID) {
    if (wx.showLoading) {
      wx.showLoading({
        title: '正在加载...',
        mask: true,
      })
    }
    var that = this
    var para = {}
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    para["task_type_id"] = encryptUtils.base64Encode(taskTypeID);
    para["village_id"] = encryptUtils.base64Encode(villageID);
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    wx.request({
      url: app.globalData.ip + "order/taskservicefees",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function (res) {
        var code = res.data.code
        var message = res.data.msg
        if (code == 100) {
          // wx.showToast({
          //   title: message,
          //   icon: 'none'
          // })
          var result = modelUtils.getModel(res.data.result)
          that.setData({
            isHaveServiceFees: true,
            serviceFees: result.service_fees
          })
        } else {
          that.setData({
            isHaveServiceFees:false
          })
          // wx.showToast({
          //   title: message,
          //   icon: 'none',
          // })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '网络异常',
          icon: 'none',

        })

      },
      complete: function () {
      }
    })
  }
})