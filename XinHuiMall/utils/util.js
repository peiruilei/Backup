const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTimeLine = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const formatTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') 
}

const formatShortTimeDay = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
}






const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
//计算小数点后几位小数 lengthStr 代表几位
function isNum(str, lengthStr) {
  if (str.length == 0) {
    return str;
  }
  if (str.match('^(-|0|([1-9]+[0-9]*))([0-9]+)?(\\.[0-9]{0,' + lengthStr + '})?').length > 1) {
    str = str.match('^(-|0|([1-9]+[0-9]*))([0-9]+)?(\\.[0-9]{0,' + lengthStr + '})?')[0];
  }
  return str;
}

function SplitNum(str) {
  var b = str.split(".");
  return b;
}

function checkPhone(phone) {
  if (!(/^1[34578]\d{9}$/.test(phone))) {
    return false;
  } else {
    return true
  }
}



function formatTimeByLine(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//计算距离，返回公里
function rad(d) {
  var PI = Math.PI;
  return d * PI / 180.0;
}

function reckonDistance(lat1, lat2, lng1, lng2) {
  var radLat1 = rad(lat1);
  var radLat2 = rad(lat2);
  var a = radLat1 - radLat2;
  var b = rad(lng1) - rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  // EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s
}


function formatShortTime(date) {
  date = date.replace(new RegExp('/', 'g'), "-");
  date = date.substring(0, date.indexOf(" "))
  return date
}
function formatShortTime1(date) {
  date = date.replace(new RegExp('-', 'g'), "/");
  // date = date.substring(0, date.indexOf(" "))
  return date
}
function getWeekDay(date) {
  var weekArray = new Array("日", "一", "二", "三", "四", "五", "六");
  var week = new Date(date).getDay();

  return "周" + weekArray[week];
}

//计算两个日期差
function daysBetween(sDate1, sDate2) {
  //Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
  var time1 = (new Date(sDate1)).getTime();
  var time2 = (new Date(sDate2)).getTime();
  // var nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
  var nDays = parseInt((time2 - time1) / 1000 / 3600 / 24);  
  console.log(nDays)
  return nDays;
};


module.exports = {
  formatTime: formatTime,
  formatTimeLine: formatTimeLine,
  isNum: isNum,
  SplitNum: SplitNum,
  formatTimeByLine: formatTimeByLine,
  formatTimeDay: formatTimeDay,
  reckonDistance: reckonDistance,
  formatShortTime: formatShortTime,
  getWeekDay: getWeekDay,
  checkPhone: checkPhone,
  daysBetween: daysBetween,
  formatShortTimeDay: formatShortTimeDay,
  formatShortTime1: formatShortTime1
 
}