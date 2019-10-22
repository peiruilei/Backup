// pages/index/goods/goodsDetail/goodsDetail.js

const app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath
var encryptUtils = require('../../../../utils/HHEncryptUtils.js')
var modelUtils = require('../../../../utils/HHModelUtils.js')
var utils = require('../../../../utils/util.js')
var WxParse = require('../../../../wxParse/wxParse.js');

var specificationNameValue = []

var first = true

Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_use: imagePath + app.globalData.common_no_data,
    goods_deafult_img: imagePath + app.globalData.goods_deafult_img,
    goods_seven_day_return: imagePath + app.globalData.goods_seven_day_return,
    content_back: imagePath + app.globalData.content_back,
    store_nav: imagePath + app.globalData.store_nav,
    common_star_red: imagePath + app.globalData.common_star_red,
    common_star_gray: imagePath + app.globalData.common_star_gray,
    home_class_bg: imagePath + app.globalData.home_class_bg,
    common_collection: imagePath + app.globalData.common_collection,
    common_uncollection: imagePath + app.globalData.common_uncollection,
    common_share: imagePath + app.globalData.common_share,
    shopping_cart_add: imagePath + app.globalData.shopping_cart_add,
    shopping_cart_less: imagePath + app.globalData.shopping_cart_less,
    goods_id: 0,
    goods_info: {},
    showNoData: true,
    msg: "请稍等...",
    isAutoplay: true,
    goods_img: "",
    goods_price: 0,
    goods_stock: 0,
    goods_gallery_list: [],
    goods_comment_list: [], //商品评论
    goods_question_list: [], //商品提问列表
    recommend_goods_list: [], //其他商品推荐
    animationData: {},
    buy_num: 1,
    specification: [],
    specificationName: [], //规格值
    specification_price: 0, //选择规格价格
    specification_group_price: 0, //选择规格团购价格/砍价价格
    specification_stock: 0, //选择的规格库存
    specification_img: "", //选择的规格的图片
    select_specification_name: [], //已选择的规格值的名字
    first_specification_value_id: 0, //一级属性ID
    second_specification_value_id: 0, // 二级属性ID
    stock_price_list: [],
    showselect: 1, //1.商品介绍 2.评价和提问
    is_colletion: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    first = true
    specificationNameValue=[]
    this.setData({
      goods_id: options.goods_id
    })

    this.getPageData(1)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (first) {
      first = false
    } else {
      this.getPageData(2)
    }

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.getPageData(2)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //获取页面数据
  getPageData: function(type) {
    if (wx.canIUse) {
      if (wx.canIUse("showLoading")) {
        wx.showLoading({
          title: '正在加载',
          mask: true
        });
      }
    }
    var that = this;
    var para = {};
    para["user_lng"] = encryptUtils.base64Encode(0);
    para["user_lat"] = encryptUtils.base64Encode(0);
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"));
    para["goods_id"] = encryptUtils.base64Encode(that.data.goods_id);
    para["v"] = encryptUtils.base64Encode(app.globalData.v);
    var str = JSON.stringify(para);
    var urlStr = encodeURIComponent(str);
    console.log(urlStr);
    wx.request({
      url: app.globalData.ip + "goodsdetail",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function success(res) {
        console.log(res);
        wx.hideLoading()
        var code = res.data.code;
        var msg = res.data.msg;
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)

          var isAutoplay = true
          for (var i = 0; i < result.goods_gallery_list.length; i++) {
            if (result.goods_gallery_list[i].type == 2) {
              isAutoplay = false
            } else {
              isAutoplay = true
            }
          }

          var specificationNameArray = []
          for (var i = 0; i < result.specification_list.length; i++) {
            specificationNameArray[i] = result.specification_list[i].spec_name
            for (var j = 0; j < result.specification_list[i].spec_value_list.length; j++) {
              result.specification_list[i].spec_value_list[j].is_select = false
            }
          }
          var select_specification_name = that.data.select_specification_name
          if (result.specification_list.length == 0) {
            select_specification_name = []
          } else if (result.specification_list.length == 1) {
            select_specification_name = [""]
          } else {
            select_specification_name = ["", ""]
          }

          specificationNameValue = specificationNameValue.concat(specificationNameArray)


          for (var i = 0; i < result.goods_comment_list.length; i++) {
            result.goods_comment_list[i].goods_score = parseInt(result.goods_comment_list[i].goods_score)
          }


          that.setData({
            goods_info: result,
            goods_gallery_list: result.goods_gallery_list,
            specification: result.specification_list,
            specificationName: specificationNameArray,
            select_specification_name: select_specification_name,
            stock_price_list: result.stock_price_list,
            goods_question_list: result.goods_question_list,
            goods_comment_list: result.goods_comment_list,
            recommend_goods_list: result.recommend_goods_list,
            showNoData: false,
            goods_img: result.goods_img,
            goods_stock: result.goods_price_stock,
            goods_price: result.goods_price,
            is_colletion: result.is_collect,
            isAutoplay: isAutoplay
          })

          if (type == 1) {
            WxParse.wxParse('article', 'html', result.goods_detail, that, 0)
          } else {

          }


        } else {
          wx.showToast({
            title: msg,
            icon: 'none'
          });

          that.setData({
            showNoData: true,
            msg: msg
          })
        }
      },
      fail: function fail(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none'
        });
        that.setData({
          showNoData: true,
          msg: '网络异常'
        })
      },
      complete: function complete() {

      }
    });
  },


  // 选择类型
  selectSpecificationValue: function(event) {
    var specificationIndex = event.currentTarget.dataset.specificationindex
    var index = event.currentTarget.dataset.index
    var specification = this.data.specification

    console.log(specification)
    console.log("父索引=" + specificationIndex)
    console.log("子索引=" + index)
    var specificationPrice = 0
    var specificationStock = 0
    var specificationGroupPrice = 0
    var specificationName = this.data.specificationName
    var specificationImg = this.data.specification_img
    console.log(specificationName)
    var selectSpecificationName = this.data.select_specification_name
    var firstSpecificationValueID = this.data.first_specification_value_id
    var secondSpecificationValueID = this.data.second_specification_value_id

    for (var i = 0; i < specification[specificationIndex].spec_value_list.length; i++) {
      if (i == index) {
        // specificationPrice = specification[specificationIndex].spec_value_list[i].is_select ? 0 : this.data.stock_price_list[i].goods_point

        // specificationPrice = specification[specificationIndex].spec_value_list[i].is_select ? 0 : this.data.stock_price_list[i].goods_price
        // if (this.data.goods_activity == 1 && this.data.left_time > 0) {
        //   specificationPrice = parseFloat(specificationPrice * this.data.discount * 0.1).toFixed(2)
        // }
        specificationImg = specification[specificationIndex].spec_value_list[i].is_select ? "" : specification[specificationIndex].spec_value_list[i].spec_value_img

        specificationStock = specification[specificationIndex].spec_value_list[i].is_select ? 0 : specification[specificationIndex].spec_value_list[i].goods_price_stock

        specification[specificationIndex].spec_value_list[i].is_select = specification[specificationIndex].spec_value_list[i].is_select ? false : true

      } else {
        specification[specificationIndex].spec_value_list[i].is_select = false

      }


    }
    var isSelect = false
    for (var i = 0; i < specification[specificationIndex].spec_value_list.length; i++) {
      if (specification[specificationIndex].spec_value_list[i].is_select) {
        isSelect = true
        selectSpecificationName[specificationIndex] = specification[specificationIndex].spec_value_list[i].spec_value_name
        if (specificationIndex == 0) {
          firstSpecificationValueID = specification[specificationIndex].spec_value_list[i].spec_value_id
        } else {
          secondSpecificationValueID = specification[specificationIndex].spec_value_list[i].spec_value_id
        }
      } else {
        if (index == i) {
          selectSpecificationName[specificationIndex] = '';
          if (specificationIndex == 0) {
            firstSpecificationValueID = 0;
          } else {
            secondSpecificationValueID = 0;
          }
          specificationPrice = this.data.goods_price;
          console.log("aa")
          specificationName[specificationIndex] = specificationNameValue[specificationIndex]
        }
      }
    }
    if (isSelect) {
      specificationName[specificationIndex] = ''
    }

    for (var i = 0; i < this.data.stock_price_list.length; i++) {
      console.log(this.data.stock_price_list[i])
      console.log(this.data.stock_price_list[i].first_specification_value_id)
      if (this.data.stock_price_list[i].first_specification_value_id == firstSpecificationValueID) {
        if (this.data.stock_price_list[i].second_specification_value_id == secondSpecificationValueID) {
          specificationPrice = this.data.stock_price_list[i].goods_price;
          specificationStock = this.data.stock_price_list[i].goods_price_stock;
          if (parseInt(this.data.buy_num) > parseInt(specificationStock)) {
            this.setData({
              buy_num: parseInt(specificationStock),
            })
          }
          break;
        }
      }
    }

    console.log(selectSpecificationName)
    this.setData({
      specification: specification,
      specification_price: specificationPrice,
      specification_img: specificationImg,
      specification_stock: specificationStock,
      specificationName: specificationName,
      select_specification_name: selectSpecificationName,
      first_specification_value_id: firstSpecificationValueID,
      second_specification_value_id: secondSpecificationValueID,
    })
    console.log("规格值=" + this.data.specificationName)
    console.log("选择的值=" + this.data.select_specification_name)
  },

  // 添加数量
  addNum: function() {
    var buyNum = this.data.buy_num + 1
    var point = this.data.specification_price == 0 ? this.data.goods_price : this.data.specification_price
    var num = this.data.specification_stock == 0 ? this.data.stock_num : this.data.specification_stock
    var restrictionsNum = parseInt(this.data.goods_info.restrictions_num)
    if (restrictionsNum > 0) {
      if (buyNum > restrictionsNum) {
        wx.showToast({
          title: '购买数量不能大于限购数量',
          icon: "none"
        })
        return;
      }
    }

    if (buyNum > this.data.goods_info.restrictions_num)

      if (this.data.buy_num < num) {
        this.setData({
          total_point: point * (parseInt(this.data.buy_num) + 1),
          buy_num: parseInt(this.data.buy_num) + 1,
        })
      } else {
        wx.showToast({
          title: '库存不足',
          icon: "none"
        })
      }

  },
  // 减少数量
  subNum: function() {
    var point = this.data.specification_price == 0 ? this.data.goods_price : this.data.specification_price
    var buyNum = this.data.buy_num - 1
    if (this.data.buy_num > 1) {
      this.setData({
        total_point: point * (parseInt(this.data.buy_num) + 1),
        buy_num: parseInt(this.data.buy_num) - 1,
      })
    }
  },
  //输入数量
  inputNum: function(event) {
    var point = this.data.specification_price == 0 ? this.data.goods_price : this.data.specification_price
    var stockNum = this.data.specification_stock == 0 ? this.data.stock_num : this.data.specification_stock
    var restrictionsNum = parseInt(this.data.goods_info.restrictions_num)
    if (restrictionsNum > 0) {
      if (parseInt(event.detail.value) > restrictionsNum) {
        wx.showToast({
          title: '购买数量不能大于限购数量',
          icon: "none"
        })
        this.setData({
          buy_num: restrictionsNum
        })
        return;
      }
    }

    if (this.data.buy_num == 0) {
      this.setData({
        buy_num: parseInt(event.detail.value)
      })
    }
    if (parseInt(event.detail.value) > parseInt(stockNum)) {
      this.setData({
        buy_num: parseInt(stockNum),
        total_point: point * (parseInt(stockNum) + 1),
      })
      wx.showToast({
        title: '库存不足',
        icon: "none"
      })
      return
    }

    if (event.detail.value.length == 0) {
      this.setData({
        buy_num: 0
      })
      return
    }
    this.setData({
      buy_num: parseInt(event.detail.value)
    })
  },

  //失去光标
  inputBlur: function(event) {
    if (event.detail.value == 0) {
      this.setData({
        buy_num: 1
      })
      wx.showToast({
        title: '数量超出范围',
        icon: "none"
      })
      return
    }
  },

  // 添加购物车
  addShopCar: function() {
    if (this.data.specificationName.length == 1 && this.data.specificationName[0] != "") {
      var title = ""
      for (var i = 0; i < this.data.specificationName.length; i++) {
        title = title + this.data.specificationName[i] + " "
      }
      console.log(title)
      wx.showToast({
        title: '请选择' + title.substring(0, title.length - 1),
        icon: 'none',
        mask: true
      })
      return
    }
    if (this.data.specificationName.length == 2 && (this.data.specificationName[0] != "" || this.data.specificationName[1] != "")) {
      var title = ""
      for (var i = 0; i < this.data.specificationName.length; i++) {
        title = title + this.data.specificationName[i] + " "
      }
      wx.showToast({
        title: '请选择' + title.substring(0, title.length - 1),
        icon: 'none',
        mask: true
      })
      return
    }

    if (this.data.specification.length > 0) {
      if (this.data.stock_num == 0 || this.data.specification_stock == 0) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
        })
        return;
      }
    } else {
      if (this.data.stock_num == 0) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
        })
        return;
      }
    }

    wx.showLoading({
      title: '请稍等...',
    })

    var para = {}
    para["goods_id"] = encryptUtils.base64Encode(this.data.goods_info.goods_id)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["buy_num"] = encryptUtils.base64Encode(this.data.buy_num)
    para["first_specification_value_id"] = encryptUtils.base64Encode(this.data.first_specification_value_id)
    para["second_specification_value_id"] = encryptUtils.base64Encode(this.data.second_specification_value_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    var that = this
    wx.request({
      url: app.globalData.ip + "addshopcart",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        wx.hideLoading()
        var code = res.data.code
        var msg = res.data.msg
        console.log(res)
        if (code == 100) {

          that.hiddenSpecification()
          setTimeout(function() {
            wx.showToast({
              title: '加入成功',
              icon: 'success',
            })
          }, 300)
        } else {
          wx.hideLoading()
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      },
      complete: function() {

      }
    })
  },



  //添加订单
  addOrder: function() {

    var clickTime = Date.now()
    if (clickTime - lastClickTime <= minClickTime) {
      return
    }
    lastClickTime = clickTime

    if (this.data.specificationName.length == 1 && this.data.specificationName[0] != "") {
      var title = ""
      for (var i = 0; i < this.data.specificationName.length; i++) {
        title = title + this.data.specificationName[i] + " "
      }
      console.log(title)
      wx.showToast({
        title: '请选择' + title.substring(0, title.length - 1),
        icon: 'none',
        mask: true
      })
      return
    }
    if (this.data.specificationName.length == 2 && (this.data.specificationName[0] != "" || this.data.specificationName[1] != "")) {
      var title = ""
      for (var i = 0; i < this.data.specificationName.length; i++) {
        title = title + this.data.specificationName[i] + " "
      }
      wx.showToast({
        title: '请选择' + title.substring(0, title.length - 1),
        icon: 'none',
        mask: true
      })
      return
    }


    if (this.data.specification.length > 0) {
      if (this.data.stock_num == 0 || this.data.specification_stock == 0) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
        })
        return;
      }
    } else {
      if (this.data.stock_num == 0) {
        wx.showToast({
          title: '库存不足',
          icon: 'none',
        })
        return;
      }
    }

    wx.showLoading({
      title: '请稍等...',
    })
    var that = this
    var para = {}
    para["goods_id"] = encryptUtils.base64Encode(that.data.goods_id)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["buy_num"] = encryptUtils.base64Encode(that.data.buy_num)
    para["first_specification_value_id"] = encryptUtils.base64Encode(that.data.first_specification_value_id)
    para["second_specification_value_id"] = encryptUtils.base64Encode(that.data.second_specification_value_id)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "orderconfirm",
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
        if (code == 100) {
          var result = modelUtils.getModel(res.data.result)

          var resultDetail = JSON.stringify(result)
          var resultDetail1 = escape(resultDetail)
          console.log(resultDetail)
          wx.navigateTo({
            url: '/pages/index/goods/addOrder/addOrder?result=' + resultDetail1 + "&order_id=" + that.data.order_id,
          })
          that.hiddenSpecification()
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
        if (wx.hideLoading) {
          wx.hideLoading()
        }
      }
    })

  },
  // 收藏
  collectGoodsPressed: function() {
    wx.showLoading({
      title: '请稍等...',
    })

    var isCollect = this.data.is_colletion
    if (isCollect == 1) {
      isCollect = 2
    } else {
      isCollect = 1
    }

    var that = this
    var para = {}
    para["key_id"] = encryptUtils.base64Encode(that.data.goods_id)
    para["collect_type"] = encryptUtils.base64Encode(1)
    para["user_id"] = encryptUtils.base64Encode(wx.getStorageSync("user_id"))
    para["mark_type"] = encryptUtils.base64Encode(isCollect)
    para["v"] = encryptUtils.base64Encode(app.globalData.v)
    var str = JSON.stringify(para)
    var urlStr = encodeURIComponent(str)
    console.log(urlStr)
    wx.request({
      url: app.globalData.ip + "collectorcancelcollect",
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'From': "WeChat"
      },
      data: {
        'para': urlStr
      },
      success: function(res) {
        wx.hideLoading()
        var code = res.data.code
        var msg = res.data.msg
        if (code == 100) {

          wx.showToast({
            title: msg,

          })

          that.setData({
            is_colletion: isCollect
          })

        } else {
          wx.showToast({
            title: msg,
            icon: 'none',
          })
        }
      },
      fail: function(res) {
        wx.hideLoading()
        wx.showToast({
          title: '网络异常',
          icon: 'none',
        })
      },
      complete: function() {

      }
    })


  },



  // 看大图
  selectImagePressed: function(event) {
    var bigImg = event.currentTarget.dataset.image
    var goods_gallery_list = this.data.goods_gallery_list
    var url = []
    var count = 0
    for (var i = 0; i < goods_gallery_list.length; i++) {
      if (goods_gallery_list[i].type == 2) {

      } else {
        url[count] = goods_gallery_list[i].big_img
        count++
      }
    }

    wx.previewImage({
      urls: url,
      current: bigImg
    })
  },

  // 显示商品规格
  showspecificationPressed: function(event) {
    var that = this

    this.setData({
      showSpecification: true,
      mark: event.currentTarget.dataset.mark
    })

    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })

    this.animation = animation

    setTimeout(function() {
      that.fadeIn()
    }, 400)
  },
  // 隐藏商品规格
  hiddenSpecification: function() {
    var that = this
    var animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
    })

    this.animation = animation

    that.fadeDown()

    setTimeout(function() {

      that.setData({
        showSpecification: false,
      })

    }, 400)
  },

  fadeIn: function() {
    this.animation.translateY(0).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  fadeDown: function() {
    this.animation.translateY(wx.getSystemInfoSync().windowHeight).step()
    this.setData({
      animationData: this.animation.export()
    })
  },

  //点击菜单
  selectMenuPress: function(event) {
    var menu_id = event.currentTarget.dataset.menu_id
    this.setData({
      showselect: menu_id
    })
  },

  //进入商品提问列表
  goToQustionListPressed: function() {
    wx.navigateTo({
      url: '/pages/index/goods/goodsDetail/goodsQuestionList/list?goods_id=' + this.data.goods_info.goods_id,
    })
  },

  // 进入商品评论
  goToCommonPressed: function() {
    wx.navigateTo({
      url: '/pages/index/goods/goodsDetail/goodsCommentList/list?goods_id=' + this.data.goods_info.goods_id,
    })
  },

  goToGoodDetailPressed: function(event) {
    var goods_id = event.currentTarget.dataset.goods_id
    wx.navigateTo({
      url: '/pages/index/goods/goodsDetail/goodsDetail?goods_id=' + goods_id,
    })
  },
  //店铺详情
  goToStorePressed: function(event) {
    var shopID = event.currentTarget.dataset.shop_id
    wx.navigateTo({
      url: '/pages/index/goods/businessDetails/businessDetails?shop_id=' + shopID,
    })

  },
  callNavPressed:function(){
    var goodsInfo = this.data.goods_info
    wx.openLocation({
      latitude: Number(goodsInfo.latitude),
      longitude: Number(goodsInfo.longitude),
      name: goodsInfo.shop_name,
      scale: 18
    })
  },


})