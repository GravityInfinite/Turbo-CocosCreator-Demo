import turbo from "../index";
import {
  isNumber,
  getQuery,
  getPlatForm,
  xhrPromise,
  dateFormate,
} from "../utils/tools";
import { header } from "./config";
const baseurl = "https://turbo.api.plutus-cat.com/event_center/api/v1";
function globalChecked() {
  if (!turbo?._globalData?.access_token) {
    throw new Error("access_token is missing, you must call init first.");
  }
  if (!turbo?._globalData?.client_id) {
    throw new Error("client_id is missing, you must call init first.");
  }
}

export const register = function (e = {}) {
  globalChecked();
  if (!e?.name) {
    throw new Error("name must be required");
  }
  if (!e?.channel) {
    throw new Error("channel must be required");
  }
  if (!e?.version && e?.version !== 0) {
    throw new Error("version must be required");
  }
  if (!isNumber(e?.version) || typeof e?.version !== "number") {
    throw new Error("version must be type: Number");
  }
  const platform = getPlatForm();
  const data = {
    client_id: turbo._globalData.client_id,
    name: e.name,
    channel: e.channel,
    version: e.version,
    media_type: platform || "tencent",
    wx_openid: e?.wx_openid || "",
    wx_unionid: e?.wx_unionid || "",
    click_id: e?.click_id || "",
    ad_data: {},
  };
  const query = getQuery();
  if (platform === "kuaishou") {
    data.ad_data = {
      callback: query?.callback || "",
      ksCampaignId: query?.ksCampaignId || "",
      ksUnitId: query?.ksUnitId || "",
      ksCreativeId: query?.ksCreativeId || "",
      ksChannel: query?.ksChannel || "",
    };
  } else if (platform === "bytedance") {
    data.ad_data = {
      clue_token: query?.clue_token || "",
      ad_id: query?.ad_id || "",
      creative_id: query?.creative_id || "",
      advertiser_id: query?.advertiser_id || "",
      request_id: query?.request_id || "",
      req_id: query?.req_id || "",
      // v2.0
      project_id: query?.project_id || "",
      promotion_id: query?.promotion_id || "",
      mid1: query?.mid1 || "",
      mid2: query?.mid2 || "",
      mid3: query?.mid3 || "",
      mid4: query?.mid4 || "",
      mid5: query?.mid5 || "",
    };
  } else if (platform === "tencent") {
    data.ad_data = { gdt_vid: query?.gdt_vid || "" };
  } else if (platform === "baidu") {
    data.ad_data = { bd_vid: query?.bd_vid || "" };
  }
  if (query?.turbo_promoted_object_id) {
    data.promoted_object_id = query.turbo_promoted_object_id;
  }
  return new Promise(function (resolve, reject) {
    const url = `${baseurl}/user/register/?access_token=${turbo._globalData.access_token}`;
    if (turbo._miniGamePlatform === "DEFAULT") {
      xhrPromise(url, data, "POST")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
      return;
    }
    turbo.platform_obj.request({
      url: `${baseurl}/user/register/?access_token=${turbo._globalData.access_token}`,
      method: "POST",
      header,
      data,
      success(res) {
        if (res.statusCode === 200) {
          resolve(res.data);
          return;
        }
        reject(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
};
export const handleEvent = function (e = {}) {
  globalChecked();
  if (!e?.event_type) {
    throw new Error("event_type must be required");
  }
  const data = {
    event_type: e.event_type || "",
  };
  if (e?.properties) {
    data.properties = e.properties;
  }
  data.use_client_time = e?.use_client_time || false;
  if (data.use_client_time && !e?.timestamp) {
    throw new Error("timestamp must be required");
  }
  if (e?.timestamp) {
    data.timestamp = e.timestamp;
  }
  if (e?.trace_id) {
    data.trace_id = e.trace_id;
  }
  return new Promise(function (resolve, reject) {
    const url = `${baseurl}/event/handle_event/?access_token=${turbo._globalData.access_token}&client_id=${turbo._globalData.client_id}`;
    if (turbo._miniGamePlatform === "DEFAULT") {
      xhrPromise(url, data, "POST")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
      return;
    }
    turbo.platform_obj.request({
      url,
      method: "POST",
      header,
      data,
      success(res) {
        res.statusCode === 200 ? resolve(res.data) : reject(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
};
export const queryUser = function () {
  globalChecked();
  const data = {
    user_list: [turbo._globalData.client_id],
  };
  return new Promise(function (resolve, reject) {
    const url = `${baseurl}/user/get/?access_token=${turbo._globalData.access_token}`;
    if (turbo._miniGamePlatform === "DEFAULT") {
      xhrPromise(url, data, "POST")
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
      return;
    }
    turbo.platform_obj.request({
      url,
      method: "POST",
      header,
      data,
      success(res) {
        res.statusCode === 200 ? resolve(res.data) : reject(res);
      },
      fail(err) {
        reject(err);
      },
    });
  });
};
