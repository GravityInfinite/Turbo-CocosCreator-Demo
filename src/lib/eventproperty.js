import turbo from "../index";

export const eventProperty = {
  properties: {},
  getAppInfoSync: function () {
    if (turbo.platform_obj?.getAccountInfoSync) {
      const info = turbo.platform_obj.getAccountInfoSync(),
        accountInfo = info && info.miniProgram ? info.miniProgram : {};
      const temp_appinfo = {
        $app_id: accountInfo.appId,
      };
      for (let item in temp_appinfo) {
        if (temp_appinfo.hasOwnProperty(item)) {
          this.properties[item] = temp_appinfo[item];
        }
      }
      return temp_appinfo;
    }
    return {};
  },
  // getNetworkType非同步，不返回值
  getNetworkType: function () {
    const _this = this;
    return new Promise(function (resolve, reject) {
      if (turbo.platform_obj?.getNetworkType) {
        turbo.platform_obj.getNetworkType({
          success: function (res) {
            _this.properties.$network_type = res.networkType;
            resolve(res);
          },
          fail: function (err) {
            reject(err);
          },
        });
      } else {
        resolve({ networkType: undefined });
      }
    });
  },
  getSystemInfoSync: function () {
    if (turbo.platform_obj?.getSystemInfoSync) {
      const info = turbo.platform_obj.getSystemInfoSync();
      const temp_systeminfo = {
        $screen_width: info.screenWidth,
        $screen_height: info.screenHeight,
        $os_version: info.system,
        $os: info.platform,
        $model: info.model,
        $brand: String(info.brand).toLocaleUpperCase(),
        $manufacturer: info.brand,
        $lib_version: "3.3.1",
        $lib: "CocosCreator",
      };
      for (let item in temp_systeminfo) {
        if (temp_systeminfo.hasOwnProperty(item)) {
          this.properties[item] = temp_systeminfo[item];
        }
      }
      return temp_systeminfo;
    }
    return {};
  },
  getRegisterProperties: function (obj = {}) {
    for (let item in obj) {
      this.properties[item] = obj[item];
    }
  },
  infoInit: function () {
    this.getAppInfoSync();
    this.getNetworkType();
    this.getSystemInfoSync();
  },
  getProperties: function () {
    return this.properties;
  },
};
