const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function netRequest({ url, data, success, fail, complete, method = "POST" }) {
  wx.showLoading({
    title: '数据加载中'
  });
  var header = { 'content-type': 'application/x-www-form-urlencoded' };
  wx.request({
    url: url,
    method: method,
    data: data,
    header: header,
    success: function (res) {
      console.log(res);
      if (res['data']['status']) {
        success(res);
      } else {
        console.log("接口请求超时" + url);
        if (fail) {
          fail(res);
        }
      }
      wx.hideLoading();
    },
    fail: fail,
    complete: complete
  })
}

function alert(content, title) {
  var _title = "提示";
  if (title) {
    _title = title;
  }
  wx.showModal({
    title: _title,
    content: content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        //console.log('用户点击确定')
      }
    }
  })
}

function replaceAll(str, reallyDo, replaceWith, ignoreCase) {
  if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
    return str.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
  } else {
    return str.replace(reallyDo, replaceWith);
  }
}

function getNowTime() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  if (month < 10) {
    month = '0' + month;
  };
  if (day < 10) {
    day = '0' + day;
  };
  var formatDate = year + '-' + month + '-' + day;
  return formatDate;
}

module.exports = {
  formatTime: formatTime,
  alert: alert,
  replaceAll: replaceAll,
  getNowTime: getNowTime,
  netRequest: netRequest
}
