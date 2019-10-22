import http from './request.js'
const url = 'https://api.hn1231.com'

//精选案例相册列表
export const selectAlbumList = (data) => http.POST(`${url}/decentralization/pc/selectAnAlbum/selectPhotoList`,data)
//首页相册活动类型的展示
export const navigateList = (data) => http.GET(`${url}/decentralization/pc/index/selectAllActivity`, data)

//预约拍摄
export const orderShot = (data) => http.POST(`${url}/wx/appointment/submitAppointmentMsg`,data)
//短信验证码
export const messageCode = (data) => http.GET(`${url}/decentralization/pc/sendcode`, data)

//浏览过的相册历史记录
export const historyAlbum = (data) => http.POST(`${url}/authorization/pc/selectAnAlbum/selectPhotoByUserId`, data)
//用户收藏的照片
export const collectedPhoto = (data) => http.POST(`${url}/picture/selectListPictureByUserId`, data)
