// pages/cart/cart.js
const app = getApp()
var Util = require('../../utils/util.js')
var loadData = function (that) {
  if (app.getUserId() == 0) {
    // app.toLogin();
  }
  // if (app.getUserId() == -1) {
  //   wx.redirectTo({
  //     url: '../login/login'
  //   });
  // }
  var url = app.getServerUrl() + "/goods/cart_list";
  var cart_type = '';
  Util.netRequest({
    url: url,
    method: 'POST',
    dataType: 'json',
    data: {
      cart_type: cart_type,
      user_id: app.getUserId()
    },
    success: function (res) {
      if (!res.data.status) {
        return;
      }
      that.setData({
        stores: res.data.data
      });
    },
    fail: function (res) { },
    complete: function (res) { }
  })
}
var selectAllBtn = function (that) {
  var _stores = that.data.stores;
  var noCheckNum = 0;
  for (var i = 0; i < _stores.length; i++) {
    var obj = _stores[i];
    if (!obj.selected) {
      noCheckNum++;
      break;
    }
  }
  if (noCheckNum == 0) {
    that.setData({
      select_flag: true
    });
  } else {
    that.setData({
      select_flag: false
    });
  }
}

var selectDpBtn = function (that, idx) {
  var _stores = that.data.stores;
  var _store = _stores[idx];
  var noCheckNum = 0;
  for (var i = 0; i < _store.goodsCarts.length; i++) {
    var obj = _store.goodsCarts[i];
    if (!obj.selected) {
      noCheckNum++;
      break;
    }
  }
  if (noCheckNum == 0) {
    _store.selected = true;
  } else {
    _store.selected = false;
  }
  _stores[idx] = _store;
  that.setData({
    stores: _stores
  });
  selectAllBtn(that);
}

var jsNumAndPrice = function (that) {
  var _goods_num = that.data.goods_num;
  var _total_price = 0;
  var _stores = that.data.stores;
  var checkNum = 0;
  for (var i = 0; i < _stores.length; i++) {
    var obj = _stores[i];
    for (var j = 0; j < obj.goodsCarts.length; j++) {
      var obj_sub = obj.goodsCarts[j];
      if (obj_sub.selected) {
        checkNum++;
        _total_price += obj_sub.price * obj_sub.count;
      }
    }
  }
  that.setData({
    goods_num: checkNum,
    total_price: _total_price.toFixed(2)
  });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stores: [],
    goods_num: 0, //购买数量
    select_flag: false,
    dwhidden: true,
    dwcontent: "超出库存",
    total_price: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: "购物车",
    });
    // loadData(this);
  },

  backFun: function () {
    loadData(this);
    this.setData({
      select_flag: false,
      total_price: '0.00',
      goods_num: 0
    });
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //删除单个商品
  deleteCart: function (event) {
    var that = this;
    var cartId = event.target.dataset.cartid;
    var url = app.getServerUrl() + "/goods/remove_goods_cart";
    Util.netRequest({
      url: url,
      method: 'POST',
      dataType: 'json',
      data: {
        id: cartId
      },
      success: function (res) {
        if (res.data.status) {
          loadData(that);
        }
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },
  deleteCarts: function (event) {
    var that = this;
    var _goods_num = this.data.goods_num;
    if (_goods_num == 0) {
      Util.alert("请选择要删除的商品");
      return;
    }
    var ids = [];
    var _stores = that.data.stores;
    for (var i = 0; i < _stores.length; i++) {
      var obj = _stores[i];
      for (var j = 0; j < obj.goodsCarts.length; j++) {
        var sub_obj = obj.goodsCarts[j];
        if (sub_obj.selected) {
          ids.push(sub_obj.id);
        }
      }
    }
    var url = app.getServerUrl() + "/goods/remove_goods_cart";
    Util.netRequest({
      url: url,
      method: 'POST',
      dataType: 'json',
      data: {
        id: ids.join(",")
      },
      success: function (res) {
        if (res.data.status) {
          wx.showModal({
            title: '提示',
            content: '删除成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                //删除按钮将所有选中的删除 所以这里将合计价格、去结算数量归0
                that.setData({
                  total_price: 0,
                  goods_num: 0
                });
                loadData(that);
              }
            }
          })

        }
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },

  selectAll: function () {
    var _stores = this.data.stores;
    var _select_flag = this.data.select_flag;
    for (var i = 0; i < _stores.length; i++) {
      _stores[i].selected = !_select_flag;
      for (var j = 0; j < _stores[i].goodsCarts.length; j++) {
        _stores[i].goodsCarts[j].selected = !_select_flag;
      }
    }
    this.setData({
      stores: _stores,
      select_flag: !_select_flag
    });
    jsNumAndPrice(this);
  },

  dpSelect: function (event) {
    var idx = event.currentTarget.id;
    var _stores = this.data.stores;
    var _selected = _stores[idx].selected;
    if (_selected) {
      _selected = false;
    } else {
      _selected = true;
    }
    _stores[idx].selected = _selected;
    for (var j = 0; j < _stores[idx].goodsCarts.length; j++) {
      _stores[idx].goodsCarts[j].selected = _selected;
    }
    this.setData({
      stores: _stores
    });
    selectAllBtn(this);
    jsNumAndPrice(this);
  },
  spSelect: function (event) {
    // debugger
    var idx = event.target.dataset.aaa;
    var idx_sub = event.target.dataset.bbb;
    var _stores = this.data.stores;
    var _store = _stores[idx];
    var _goodsCart = _store.goodsCarts[idx_sub];
    var _selected = false;
    if (_goodsCart.selected) {
      _selected = false;
    } else {
      _selected = true;
    }
    _goodsCart.selected = _selected;
    _stores[idx] = _store;
    this.setData({
      stores: _stores
    });
    selectDpBtn(this, idx);
    jsNumAndPrice(this);
  },

  changeNum: function (event) {
    var that = this;
    var t = event.target.dataset.type;
    var _kucun = event.target.dataset.kucun * 1;
    var idx = event.target.dataset.aaa;
    var idx_sub = event.target.dataset.bbb;
    var _stores = this.data.stores;
    var _store = _stores[idx];
    var _goodsCart = _store.goodsCarts[idx_sub];
    var count = _goodsCart.count * 1;
    console.log(_kucun + "=====" + idx + "==aaaaaaa=" + count);
    if (count > _kucun) {
      Util.alert("超出库存");
      return;
    }
    if (t == 1) {//减
      if (count == 1) {
        return;
      } else {
        count--;
      }
    } else {//加
      if (count >= _kucun) {
        count = _kucun;
        Util.alert("超出库存");
        return;
      } else {
        count++;
      }
    }
    var url = app.getServerUrl() + "/goods/update_cart_goods";
    Util.netRequest({
      url: url,
      method: 'POST',
      dataType: 'json',
      data: {
        abs: count,
        goods_cart_id: _goodsCart.id,
        user_id: app.getUserId()
      },
      success: function (res) {
        if (!res.data.status) {
          return;
        }
        _goodsCart.count = count;
        _store.goodsCarts[idx_sub] = _goodsCart;
        _stores[idx] = _store;
        that.setData({
          stores: _stores
        });
        jsNumAndPrice(that);
      },
      fail: function (res) {
        Util.alert(res.data.message);
      },
      complete: function (res) { }
    })
  },
  /**
  * 知道了
  */
  zdl: function () {
    this.setData({
      dwhidden: true
    });
  },
  jieSuan: function () {
    var that = this;
    var _goods_num = this.data.goods_num;
    if (_goods_num == 0) {
      Util.alert("请选择需要购买的商品");
      return;
    }
    var url = app.getServerUrl() + "/getUserInfo";
    Util.netRequest({
      url: url,
      method: 'POST',
      dataType: 'json',
      data: {
        user_id: app.getUserId()
      },
      success: function (res) {
        if (!res.data.status) {
          return;
        }
        var addressId = 0;
        if (res.data.data.defaultAdddress) {
          addressId = res.data.data.defaultAdddress
        }
        var defaultAddress = true;
        var _stores = that.data.stores;
        var _storeIds = "";
        var _cartIds = "";
        var _goodsIds = "";
        for (var i = 0; i < _stores.length; i++) {
          var obj = _stores[i];
          if (obj.selected) {
            _storeIds += obj.id + ",";
          }
          for (var j = 0; j < obj.goodsCarts.length; j++) {
            var sub_obj = obj.goodsCarts[j];
            if (sub_obj.selected) {
              _cartIds += sub_obj.id + ",";
              _goodsIds += sub_obj.goods.id + ",";
            }
          }
        }
        var _url = '../order/order_confirm?type=2&actype=1&addressId=' + addressId + '&default=' + defaultAddress + '&storeIds=' + _storeIds.substring(0, _storeIds.length - 1) + '&cartIds=' + _cartIds.substring(0, _cartIds.length - 1) + '&goodsIds=' + _goodsIds.substring(0, _goodsIds.length - 1);
        console.log("-----" + _url);
        wx.navigateTo({
          url: _url
        });
      },
      fail: function (res) { },
      complete: function (res) { }
    })
  },

  toIndex: function () {
    Util.toIndex();
  },
  openDetail: function (event) {
    var id = event.currentTarget.id;
    wx.navigateTo({
      url: '../detail/detail?goods_id=' + id
    });
  },
})