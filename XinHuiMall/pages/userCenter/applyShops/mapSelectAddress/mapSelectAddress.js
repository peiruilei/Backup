// pages/userCenter/applyShops/mapSelectAddress/mapSelectAddress.js

var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');
var qqmapsdk = new QQMapWX({
  key: 'ZNUBZ-KJ36W-QRBRV-RIU7K-5K2EZ-YEFAX'
});

var app = getApp()
var lastClickTime = 0
var minClickTime = app.globalData.minClickTime
var imagePath = app.globalData.imagePath

Page({

  /**
   * 页面的初始数据
   */
  data: {

    usercenter_map_marker: imagePath + app.globalData.usercenter_map_marker,
    ddListShow: false,
    regionShow: {
      province: false,
      city: false,
      district: true
    },
    regionData: {},
    currentRegion: {
      district: '选择城市',
    },
    currentDistrict: '选择城市',
    latitude: '',
    longitude: '',
    centerData: {},
    nearList: [],
    suggestion: [],
    selectedId: 0,
    defaultKeyword: '',
    keyword: '',
    input_value: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this;
    // if (options != "undefined") {
    //   self.setData({
    //     defaultKeyword: options.district_name
    //   })
    //   console.log(self.data.defaultKeyword)
    // }

    self.mapCtx = wx.createMapContext('myMap')
    wx.showLoading({
      title: '加载中'
    });
    //定位
    wx.getLocation({
      type: 'gcj02',
      success(res) {
        console.log(res)
        const latitude = res.latitude
        const longitude = res.longitude
        const speed = res.speed
        const accuracy = res.accuracy
        //你地址解析
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            console.log(res)
            if (self.data.defaultKeyword.length > 0) {
              self.setData({
                latitude: latitude,
                longitude: longitude,
                currentRegion: res.result.address_component,
                keyword: self.data.defaultKeyword
              })
            } else {
              self.setData({
                latitude: latitude,
                longitude: longitude,
                currentRegion: res.result.address_component,
                // defaultKeyword: res.result.ad_info.district,
                // keyword: res.result.ad_info.district,
                defaultKeyword: res.result.formatted_addresses.recommend,
                keyword: res.result.formatted_addresses.recommend
              })
            }

            // 调用接口
            self.nearby_search();
          },
        });
      },
      fail(err) {
        //console.log(err)
        wx.hideLoading({});
        wx.showToast({
          title: '定位失败',
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 1500)
      }
    })
  },

  //监听拖动地图，拖动结束根据中心点更新页面
  mapChange: function (e) {
    let self = this;
    if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
      self.mapCtx.getCenterLocation({
        success: function (res) {
          console.log(res)
          self.setData({
            nearList: [],
            latitude: res.latitude,
            longitude: res.longitude,
          })
          //你地址解析
          qqmapsdk.reverseGeocoder({
            location: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            success: function (res) {
              console.log(res)

              self.setData({
                latitude: res.result.location.lat,
                longitude: res.result.location.lng,
                currentRegion: res.result.address_component,
                // defaultKeyword: res.result.ad_info.district,
                // keyword: res.result.ad_info.district,
                defaultKeyword: res.result.formatted_addresses.recommend,
                keyword: res.result.formatted_addresses.recommend
              })

              // 调用接口
              self.nearby_search();
            },
          });
        }
      })
    }

  },
  //重新定位
  reload: function () {
    var op = {}
    op.district_name = this.data.defaultKeyword
    this.onLoad(op);
  },
  onShow: function () {
    let self = this;
  },
  //地图标记点
  addMarker: function (data) {
    var mks = [];
    mks.push({ // 获取返回结果，放到mks数组中
      title: data.title,
      id: data.id,
      addr: data.addr,
      province: data.province,
      city: data.city,
      district: data.district,
      latitude: data.latitude,
      longitude: data.longitude,
      iconPath: "/images/my_marker.png", //图标路径
      width: 25,
      height: 25
    })
    this.setData({ //设置markers属性，将搜索结果显示在地图中
      markers: mks,
      currentRegion: {
        province: data.province,
        city: data.city,
        district: data.district,
      }
    })
    wx.hideLoading({});
  },
  //点击选择搜索结果
  backfill: function (e) {
    var id = e.currentTarget.id;
    let name = e.currentTarget.dataset.name;
    for (var i = 0; i < this.data.suggestion.length; i++) {
      if (i == id) {
        //console.log(this.data.suggestion[i])
        this.setData({
          centerData: this.data.suggestion[i],
          addListShow: false,
          latitude: this.data.suggestion[i].latitude,
          longitude: this.data.suggestion[i].longitude
        });
        this.nearby_search();
        return;
        //console.log(this.data.centerData)
      }
    }
  },
  //点击选择地图下方列表某项
  chooseCenter: function (e) {
    var id = e.currentTarget.id;
    let name = e.currentTarget.dataset.name;
    for (var i = 0; i < this.data.nearList.length; i++) {
      if (i == id) {
        this.setData({
          selectedId: id,
          centerData: this.data.nearList[i],
          latitude: this.data.nearList[i].latitude,
          longitude: this.data.nearList[i].longitude,
        });
        this.addMarker(this.data.nearList[id]);
        return;
        //console.log(this.data.centerData)
      }
    }
  },
  //显示搜索列表
  showAddList: function () {
    this.setData({
      addListShow: true
    })
  },
  // 根据关键词搜索附近位置
  nearby_search: function () {
    var self = this;
    wx.hideLoading();
    wx.showLoading({
      title: '加载中'
    });
    // 调用接口
    qqmapsdk.search({
      keyword: self.data.keyword, //搜索关键词
      location: self.data.latitude + ',' + self.data.longitude,
      page_size: 20,
      page_index: 1,
      success: function (res) { //搜索成功后的回调
        //console.log(res.data)
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].ad_info.province,
            city: res.data[i].ad_info.city,
            district: res.data[i].ad_info.district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        self.setData({
          selectedId: 0,
          centerData: sug[0],
          nearList: sug,
          suggestion: sug
        })
        self.addMarker(sug[0]);
      },
      fail: function (res) {
        //console.log(res);
      },
      complete: function (res) {
        //console.log(res);
      }
    });
  },
  //根据关键词搜索匹配位置
  getsuggest: function (e) {
    var _this = this;
    var keyword = e.detail.value;
    _this.setData({
      addListShow: true
    })
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      location: _this.data.latitude + ',' + _this.data.longitude,
      page_size: 20,
      page_index: 1,
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) { //搜索成功后的回调
        //console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].province,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug,
          nearList: sug,
          keyword: keyword
        });
      },
      fail: function (error) {

      },
      complete: function (res) {

      }
    });
  },
  //确认选择地址
  selectedOk: function () {
    console.log(this.data.centerData)
    var pages = getCurrentPages()
    var lastPages = pages[pages.length - 2]
    lastPages.setData({
      latitude: this.data.centerData.latitude,
      longitude: this.data.centerData.longitude,
      receipt_address: this.data.centerData.province + this.data.centerData.city + this.data.centerData.district,
      address_detail: this.data.centerData.title
    })
    wx.navigateBack({
      delta: 1
    })
  },
  //搜索
  btnSearch: function () {
    var _this = this;
    if (_this.data.input_value == 0) {
      wx.showToast({
        title: '请输入地址',
        icon: "none"
      })
      return;
    }
    var keyword = _this.data.keyword
    _this.setData({
      addListShow: true
    })
    //调用关键词提示接口
    qqmapsdk.getSuggestion({
      //获取输入框值并设置keyword参数
      keyword: keyword, //用户输入的关键词，可设置固定值,如keyword:'KFC'
      location: _this.data.latitude + ',' + _this.data.longitude,
      page_size: 20,
      page_index: 1,
      //region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
      success: function (res) { //搜索成功后的回调
        //console.log(res);
        var sug = [];
        for (var i = 0; i < res.data.length; i++) {
          sug.push({ // 获取返回结果，放到sug数组中
            title: res.data[i].title,
            id: res.data[i].id,
            addr: res.data[i].address,
            province: res.data[i].province,
            city: res.data[i].city,
            district: res.data[i].district,
            latitude: res.data[i].location.lat,
            longitude: res.data[i].location.lng
          });
        }
        _this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
          suggestion: sug,
          nearList: sug,
          keyword: keyword
        });
      },
      fail: function (error) {

      },
      complete: function (res) {

      }
    });
  },
  input_value: function (event) {
    var that = this
    that.setData({
      input_value: event.detail.value,
      keyword: event.detail.value
    })
  },
  watchKey: function (event) {
    var that = this
    that.setData({
      input_value: event.detail.value,
      keyword: event.detail.value
    })
  },
})
