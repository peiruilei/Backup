//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function(options) {
    console.log("=================onShow=================2222222222==" + JSON.stringify(options))
    if (options.scene == 1011 || options.scene == 1012) {
      var qrContent = decodeURIComponent(options.query.q);
      console.log("pUserIDStr=qrContent=" + qrContent)
      if (typeof(qrContent) != "undefined" && qrContent != "undefined" && qrContent.length > 0) {
        if (qrContent.indexOf("p_id") > 0) {
          var pUserID;
          pUserID = this.getQueryString(qrContent, "p_id");
          wx.setStorageSync("p_user_id", pUserID)
        }
      }
    }
  },
  getQueryString: function(local_url, par) {
    //获取当前URL
    //获取要取得的get参数位置
    var get = local_url.indexOf(par + "=");
    if (get == -1) {
      return false;
    }
    //截取字符串
    var get_par = local_url.slice(par.length + get + 1);
    //判断截取后的字符串是否还有其他get参数
    var nextPar = get_par.indexOf("&");
    if (nextPar != -1) {
      get_par = get_par.slice(0, nextPar);
    }
    return get_par;
  },

  globalData: {
    userInfo: null,
    ip: 'http://116.255.236.229:8351/',
    imagePath: "http://116.255.236.229:8351/wechatimage/",
    pageSize: 10,
    minClickTime: 500,
    v: "1.0.1",
    appid: "wxa3e371f4afeadf21",
    secret: "fb2f8b07124f162cdad1712ad747a13f",

    login_top_bg: "login/login_top_bg.png",
    login_wechat: "login/login_wechat.png",
    login_protocol_unselect: "login/login_protocol_unselect.png",
    login_protocol_select: "login/login_protocol_select.png",
    login_accept_content: "login/login_accept_content.png",
    writeoff_scancode_bg: "writeOff/writeoff_scancode_bf.png",
    writeOff_date_end: "writeOff/writeOff_date_end.png",
    writeOff_over: "writeOff/writeOff_over.png",

    home_search: "home/home_search.png",
    home_class_bg: "home/home_class_bg.png",
    home_select_city: "home/home_select_city.png",
    home_red_packet_bg: "home/home_red_packet_bg.png",
    
    red_envelop_rush: "home/red_envelop_rush.png",
    red_page_bg: "home/red_page_bg.png",
    popup_red_bg: "home/popup_red_bg.png",
    quick_get_red_bg: "home/quick_get_red_bg.png",
    shops_red_bg: "home/shops_red_bg.png",
    new_red_page_bg: "home/new_red_page_bg.png",
    new_red_popup_bg: "home/new_red_popup_bg.png",
    red_line_right: "home/red_line_right.png",
    red_line_left: "home/red_line_left.png",
    goods_deafult_img: "goods/goods_deafult_img.png",
    goods_seven_day_return: "goods/goods_seven_day_return.png",
    goods_class_red: "goods/goods_class_red.png",
    goods_class_gray: "goods/goods_class_gray.png",
    slash_left: "goods/slash_left.png",
    slash_right: "goods/slash_right.png",
    store_nav: "goods/store_nav.png",
    paySuccess_top_bg: "goods/paySuccess_top_bg.png",
    shopDetail_address: "goods/shopDetail_address.png",
    shopDetail_assess_light: "goods/shopDetail_assess_light.png",
    shopDetail_assess: "goods/shopDetail_assess.png",
    shopDetail_collect: "goods/shopDetail_collect.png",
    shopDetail_nocollect: "goods/shopDetail_nocollect.png",
    shopDetail_phone: "goods/shopDetail_phone.png",
    goodsAssess_like: "goods/goodsAssess_like.png",
    goodsAssess_like_light: "goods/goodsAssess_like_light.png",

    common_round_dele: "common/common_round_dele.png",
    common_dele: "common/common_dele.png",
    common_red_rain_bg: "common/common_red_rain_bg.png",
    common_star_red: "common/common_star_red.png",
    common_star_gray: "common/common_star_gray.png",
    common_collection: "common/common_collection.png",
    common_uncollection: "common/common_uncollection.png",
    common_share: "common/common_share.png",
    common_select: "common/common_select.png",
    common_un_select: "common/common_un_select.png",
    common_edit: "common/common_edit.png",
    common_address_dele: "common/common_address_dele.png",
    common_no_data: "common/common_no_data.png",
    common_upload_img: "common/common_upload_img.png",
    address_location: "common/address_location.png",

    pay_wx: "pay/pay_wx.png",
    pay_balance: "pay/pay_balance.png",
    usercenter_map_marker: "userCenter/usercenter_map_marker.png",
    userCenter_headimg: "userCenter/userCenter_headimg.png",
    userCenter_setting: "userCenter/userCenter_setting.png",
    free_markdown: "userCenter/free_markdown.png",
    userCenter_address: "userCenter/userCenter_address.png",
    userCenter_apply: "userCenter/userCenter_apply.png",
    userCenter_contact: "userCenter/userCenter_contact.png",
    userCenter_message: "userCenter/userCenter_message.png",
    userCenter_proxy: "userCenter/userCenter_proxy.png",
    userCenter_shoppingcart: "userCenter/userCenter_shoppingcart.png",
    userCenter_think: "userCenter/userCenter_think.png",
    userCenter_twogold: "userCenter/userCenter_twogold.png",
    userCenter_Voucher_warehouse: "userCenter/userCenter_Voucher_warehouse.png",
    userCenter_Voucher: "userCenter/userCenter_Voucher.png",
    userCenter_Free_event: "userCenter/userCenter_Free_event.png",
    userCenter_settingLight: "userCenter/userCenter_settingLight.png",
    userCenter_attention: "userCenter/userCenter_attention.png",
    userCenter_VIP: "userCenter/userCenter_VIP.png",
    userCenter_client: "userCenter/userCenter_client.png",
    userCenter_shopInfo: "userCenter/userCenter_shopInfo.png",
    userCenter_voucher_package: "userCenter/userCenter_voucher_package.png",
    wechat_icon: "userCenter/wechat_icon.png",
    coupon_gift: "userCenter/coupon_gift.png",
    coupon_qr: "userCenter/coupon_qr.png",
    coupon_top_bg_nolight: "userCenter/coupon_top_bg_nolight.png",
    coupon_top_bg: "userCenter/coupon_top_bg.png",
    coupon_use: "userCenter/coupon_use.png",
    coupon_navigate: "userCenter/coupon_navigate.png",
    shopping_cart_add: "userCenter/shopping_cart_add.png",
    shopping_cart_less: "userCenter/shopping_cart_less.png",
    shopping_cart_noselect: "userCenter/shopping_cart_noselect.png",
    shopping_cart_select: "userCenter/shopping_cart_select.png",
    shopping_cart_icon: "userCenter/shopping_cart_icon.png",
    event_detail_top_bg: "userCenter/event_detail_top_bg.png",
    event_detail_icon: "userCenter/event_detail_icon.png",
    userCenter_top_bg: "userCenter/userCenter_top_bg.png",
    delete_popup: "userCenter/delete_popup.png",
    delete_pop: "userCenter/delete_pop.png",
    apply_success: "userCenter/apply_success.png",
    content_back: "content/content_back.png",
    content_message_read: "content/content_message_read.png",
    content_message_notRead: "content/content_message_notRead.png",
    content_bg: "content/content_bg.png",
    content_accountdetail: "content/content_accountdetail.png",
    content_withdrawrecordlist: "content/content_withdrawrecordlist.png",
    content_withdraw_select: "content/content_withdraw_select.png",
    content_withdraw_success: "content/content_withdraw_success.png",
    content_withdraw_wait: "content/content_withdraw_wait.png",
    content_subsidy_bg: "content/content_subsidy_bg.png",
    content_subsidy_no: "content/content_subsidy_no.png",
    content_subsidy_payTime_bg: "content/content_subsidy_payTime_bg.png",
    content_account_friend: "content/content_account_friend.png",
    content_account_goods: "content/content_account_goods.png",
    content_account_partner: "content/content_account_partner.png",
    content_icon: "content/content_icon.png",
    content_vip_bg: "content/content_vip_bg.png",
    content_feedBack_choose: "content/content_feedBack_choose.png",
    content_feedBack_no_choose: "content/content_feedBack_no_choose.png",
    content_camera: "content/content_camera.png",
    content_withdraw_no: "content/content_withdraw_no.png",
  
    showQR_top_bg:"orderList/showQR_top_bg.png",
    order_detail_copy: "orderList/order_detail_copy.png",
    QR_icon: "orderList/QR_icon.png",
    apply_return_price_icon: "orderList/apply_return_price_icon.png"
  }
})