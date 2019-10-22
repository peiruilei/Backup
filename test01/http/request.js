function http (obj){
  return new Promise((resolve,reject)=>{
    let options = {
      url: '',
      method: 'GET',
      dataType: 'json',
      header: {
        "content-type": "application/json",
        "X-requested-With": "XMLHttpRequest"
      },
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    }
    
    options = { ...options,
          ...obj
    }
    // console.log(options)
    if (options.url && options.method) {
      wx.request(options);
    } else {
      wx.showToast({
        title: 'HTTP：缺失参数',
        icon: "none",
        duration: 2000
      })
    }

  })
}

export default{
  GET( url,data = {} ){
    return http({
      url,
      data,
      method: "GET"
    })
  },
  POST( url,data={}  ){
    return http({
      url,
      data,
      method: "POST"
    })
  }
}