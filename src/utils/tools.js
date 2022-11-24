import turbo from "../index";

export function isNumber(a) {
  return "number" === typeof a
    ? 0 === a - a
    : "string" === typeof a && "" !== a.trim()
    ? Number.isFinite
      ? Number.isFinite(+a)
      : isFinite(+a)
    : !1;
}

export function getMiniGamePlatform() {
  var t = cc.sys.platform,
    e =
      cc.sys?.WECHAT_GAME ||
      (cc.sys?.Platform ? cc.sys.Platform?.WECHAT_GAME : "")
  return t === e ? "WECHAT_GAME" : "DEFAULT";
}

export function getQuery() {
  const currentPlatform =
    cc.sys?.WECHAT_GAME ||
    (cc.sys?.Platform ? cc.sys.Platform?.WECHAT_GAME : "");
  if (cc.sys.platform === currentPlatform) {
    return wx.getLaunchOptionsSync().query || {};
  }
  return {};
}

export function getPlatForm() {
  const query = getQuery();
  if (query.ksUnitId || query.ksCampaignId || query.ksChannel) {
    return "kuaishou";
  } else if (
    query.clue_token ||
    query.ad_id ||
    query.creative_id ||
    query.request_id ||
    query.advertiser_id
  ) {
    return "bytedance";
  } else {
    return "";
  }
}

export function setQuery(obj) {
  const str = [];
  for (let p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
}

export const logger = {
  info: function () {
    if (turbo?._para?.show_log) {
      if (typeof console === "object" && console.log) {
        try {
          if (arguments.length === 3) {
            return console.log(arguments[0], arguments[1], arguments[2]);
          }

          if (arguments.length === 2) {
            return console.log(arguments[0], arguments[1]);
          }

          if (arguments.length === 1) {
            return console.log(arguments[0]);
          }
        } catch (e) {
          console.log(arguments[0]);
        }
      }
    }
  },
};

export function getStorageSync(storage_key) {
  let store = "";
  try {
    store = cc.sys.localStorage.getItem(storage_key);
  } catch (e) {
    try {
      store = cc.sys.localStorage.getItem(storage_key);
    } catch (e2) {
      logger.info("getStorage fail");
    }
  }
  return store;
}
var ObjProto = Object.prototype;
var ArrayProto = Array.prototype;
var nativeForEach = ArrayProto.forEach;
var hasOwnProperty = ObjProto.hasOwnProperty;
var slice = ArrayProto.slice;

export function isObject(obj) {
  if (obj === undefined || obj === null) {
    return false;
  } else {
    return toString.call(obj) == "[object Object]";
  }
}

function each(obj, iterator, context) {
  if (obj == null) {
    return false;
  }
  var breaker = {};
  if (nativeForEach && obj.forEach === nativeForEach) {
    obj.forEach(iterator, context);
  } else if (obj.length === +obj.length) {
    for (var i = 0, l = obj.length; i < l; i++) {
      if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
        return false;
      }
    }
  } else {
    for (var item in obj) {
      if (hasOwnProperty.call(obj, item)) {
        if (iterator.call(context, obj[item], item, obj) === breaker) {
          return false;
        }
      }
    }
  }
}

function extend(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0) {
        obj[prop] = source[prop];
      }
    }
  });
  return obj;
}

export function extend2Lev(obj) {
  each(slice.call(arguments, 1), function (source) {
    for (var prop in source) {
      if (source[prop] !== void 0 && source[prop] !== null) {
        if (isObject(source[prop]) && isObject(obj[prop])) {
          extend(obj[prop], source[prop]);
        } else {
          obj[prop] = source[prop];
        }
      }
    }
  });
  return obj;
}

export function getCurrentPage() {
  var obj = {};
  try {
    var pages = getCurrentPages();
    obj = pages[pages.length - 1];
  } catch (error) {
    logger.info(error);
  }

  return obj;
}

export function xhrPromise(url, data, method) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(JSON.parse(xhr.responseText));
        }
      }
    };
    xhr.open(method, url, true);
    xhr.send(JSON.stringify(data));
  });
}

export function dateFormate(dateTime, timeflag) {
  const date = new Date(Date.parse(dateTime));
  const y = date.getFullYear();
  let m = date.getMonth() + 1;
  m = m < 10 ? `0${m}` : m;
  let d = date.getDate();
  d = d < 10 ? `0${d}` : d;
  let h = date.getHours();
  h = h < 10 ? `0${h}` : h;
  let minute = date.getMinutes();
  minute = minute < 10 ? `0${minute}` : minute;
  let seconds = date.getSeconds();
  seconds = seconds < 10 ? `0${seconds}` : seconds;
  let result = "";
  if (timeflag) {
    result = `${y}-${m}-${d} ${h}:${minute}:${seconds}`;
  } else {
    result = `${y}-${m}-${d}`;
  }
  return result;
}
