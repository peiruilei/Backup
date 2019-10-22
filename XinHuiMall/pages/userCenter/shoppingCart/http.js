var encryptUtils = require('../../../utils/HHEncryptUtils.js')
var rootDocment = getApp().globalData.ip;
var header = {
  'From': "WeChat",
  'content-type': 'application/x-www-form-urlencoded'
}
//普通请求
function postReq(url, data, cb) {
  var para = {}
  for (let i in data) {
    para[i] = encryptUtils.base64Encode(data[i]);
  }
  var str = JSON.stringify(para)
  var urlStr = encodeURIComponent(str)
  wx.showLoading({
    title: '加载中',
  })
  console.log("urlStr==" + urlStr),
    wx.request({
      url: rootDocment + url,
      header: header,
      data: {
        'para': urlStr
      },
      method: 'post',
      success: function (res) {
        wx.hideLoading();
        return typeof cb == "function" && cb(res.data)
      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
        return typeof cb == "function" && cb(false)
    },
    complete: function () {
      wx.stopPullDownRefresh()
    }
    })

}
// 购物车加减商品数量
function postChangeNum(url, data, cb) {
  var para = {}
  for (let i in data) {
    para[i] = encryptUtils.base64Encode(data[i]);
  }
  var str = JSON.stringify(para)
  var urlStr = encodeURIComponent(str)
  console.log("urlStr==" + urlStr),
    wx.request({
      url: rootDocment + url,
      header: header,
      data: {
        'para': urlStr
      },
      method: 'post',
      success: function (res) {
        return typeof cb == "function" && cb(res.data)
      },
      fail: function () {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
        return typeof cb == "function" && cb(false)
      },
      complete: function () {
      }
    })

}
// 只有成功提示
function postMsg(url, data) {

  var para = {}
  for (let i in data) {
    para[i] = encryptUtils.base64Encode(data[i]);
  }
  var str = JSON.stringify(para)
  var urlStr = encodeURIComponent(str)
  wx.showLoading({
    title: '加载中',
  })
  console.log("urlStr==" + urlStr),
    wx.request({
      url: rootDocment + url,
      header: header,
      data: {
        'para': urlStr
      },
      method: 'post',
      success: function (res) {
        wx.hideLoading();
         if (res.data.code == 100){
        wx.showToast({
          title: res.data.msg,
        })
         }else{
           wx.showToast({
             title: res.data.msg,
             icon:'none'
           })
         }

      },
      fail: function () {
        wx.hideLoading();
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
        })
    },
    complete: function () {
      wx.stopPullDownRefresh()
    }
    })

}

module.exports = {
  postReq: postReq,
  postMsg:postMsg,
  postChangeNum: postChangeNum
}
