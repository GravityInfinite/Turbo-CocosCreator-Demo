# CocosCreator接入

本文档为CocosCreator接入 [turbo 引力引擎](https://gravity-engine.com/)的技术接入方案，具体 Demo 请参考[GitHub](https://github.com/GravityInfinite/Turbo-CocosCreator-Demo)。

注：目前仅支持微信小游戏平台。

目前支持以下买量平台跳转微信小游戏

1. 巨量引擎
2. 磁力引擎
3. 广点通

### 1. 集成引力引擎 SDK

#### 1.1 导入 SDK

- 从[GitHub](https://github.com/GravityInfinite/Turbo-CocosCreator-Demo/releases)上获取CocosCreator SDK 源码；
- 将 `turbo.min.js`文件放入小游戏项目中；

```javascript
import turbo from "./utils/turbo.min.js";
```

#### 1.2 配置初始化参数

引入 SDK 后，可通过 `setPara()` 可进行 SDK 初始化参数配置：

```javascript
/**
引入SDK后，可通过setPara配置初始化参数
 */
turbo.setPara({
  autoTrack: {
    // autoTrack参数 可用于配置需要开启的全埋点类型：
    appLaunch: true, // 默认为 true，false 则关闭 $MPLaunch 事件采集
    appShow: true, // 默认为 true，false 则关闭 $MPShow 事件采集
    appHide: true, // 默认为 true，false 则关闭 $MPHide 事件采集
  },
  show_log: true, // 默认为 false，true 则在事件发生时打印log到console控制台，方便调试，建议在开发阶段打开
});
```

#### 1.3 初始化 SDK

`setPara()` 配置初始化参数后，可调用 `init()` 方法来初始化 SDK：

```javascript
/**
 * 此方法会初始化Turbo需要的基础参数（需要确保每次启动都必须要调用）
 * @param {string} accessToken    项目通行证，在：网站后台-->管理中心-->应用列表中找到Access Token列 复制（首次使用可能需要先新增应用）
 * @param {string} client_id      用户唯一标识，如微信小游戏的openid
 */
turbo.init("your_access_token", "your_client_id");
```

> 📢 注意：在调用 `init()` 接口之前，采集的数据被缓存在内存中；调用 `init()` 接口后，会将缓存的数据通过网络发送出去。

#### 1.4 配置项目合法域名

参考[微信官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/ability/network.html)，将 https://turbo.api.plutus-cat.com 配置到微信后台 request 合法域名列表中。

---

### 2. SDK 基本配置

#### 2.1 用户注册引力引擎

在用户注册或者可以获取到用户唯一性信息时调用此方法，推荐首次安装启动时调用，后续其他接口，均需要等 `register`接口完成之后才能继续调用

```javascript
/**
 * @param {string} name         用户名（必填）
 * @param {string} channel      用户注册渠道（必填）
 * @param {number} version      用户注册的程序版本（必填）
 * @param {string} click_id     用户点击广告id 微信小游戏选填
 * @param {string} wx_openid    微信open id (微信小游戏必填)
 * @param {string} wx_unionid   微信union id（微信小游戏选填）
 */

turbo
  .register({
    name: "user_name",
    channel: "user_channel",
    version: 123,
    click_id: "user_click_id",
    wx_openid: "user_wx_openid",
    wx_unionid: "user_wx_unionid",
  })
  .then(() => {
    // 在这之后继续做其他的方法调用
  });
```

#### 2.2 用户注册事件上报

当用户注册成功时，需要调用 `registerEvent`方法记录用户注册事件

```javascript
turbo.registerEvent();
```

#### 2.3 用户登录事件上报

当用户登录成功时，需要调用 `loginEvent`方法记录用户登录事件

```javascript
turbo.loginEvent();
```

#### 2.4 用户注销登录事件上报

当用户注销登录时，需要调用 `logoutEvent`方法记录用户登出事件

```javascript
turbo.logoutEvent();
```

#### 2.5 买量埋点事件上报

当发生以下买量节点事件时，通过 `handleEvent`方法上报事件

```javascript
/**
 * 埋点事件上报
 * @param {string} event_type 埋点事件类型 分为
    activate                          激活
    register                          注册
    pay                               付费
    twice                             次留
    key_active                        关键行为
 * @param properties          event_type=pay时必填，结构体，包含以下字段
    amount:                           原价金额,单位为分
    real_amount:                      实际付款金额,单位为分
 * @param {number} timestamp  事件发生时间 毫秒时间戳
 * @param {boolean} use_client_time  是否使用上报的timestamp作为回传时间，默认为false，当为true时，timestamp必填
 * @param {string} trace_id  本次事件的唯一id（重复上报会根据该id去重，trace_id的长度不能超过128），可填入订单id，请求id等唯一值。如果为空，turbo则会自动生成一个。
 */

turbo
  .handleEvent({
    event_type: "pay",
    properties: {
      amount: 200,
      real_amount: 180,
    },
    timestamp: 1663227655000,
    use_client_time: true,
    trace_id: "your_trace_id",
  })
  .then(() => {

  });
```

#### 2.6 查询用户信息

可以通过调用 `queryUser`方法获知当前用户的买量信息

```javascript
/**
 * 查询用户信息，包括
 * 1. client_id       用户ID
 * 2. channel         用户渠道
 * 3. click_company   用户买量来源，枚举值 为：tencent、bytedance、kuaishou  为空则为自然量用户
 * 4. aid             广告计划ID
 * 5. cid             广告创意ID
 * 6. advertiser_id   广告账户ID
 * 7. bytedance_v2    头条体验版数据（用户如果为头条体验版投放获取的，bytedance_v2才有值）
 *    1. project_id   项目ID
 *    2. promotion_id 广告ID
 *    3. mid1         图片ID
 *    4. mid2         标题ID
 *    5. mid3         视频ID
 *    6. mid4         试完ID
 *    7. mid5         落地页ID
 *
 * 返回示例如下，具体可以打印返回的data查看
 * "user_list": [
      {
        "create_time": "2022-09-09 14:50:04",
        "client_id": "Bn2RhTcU",
        "advertiser_id": "12948974294275",
        "channel": "wechat_mini_game",
        "click_company": "gdt",
        "aid": "65802182823",
        "cid": "65580218538",
        "bytedance_v2": {
          "project_id":"924563792",
          "promotion_id":"93795753",
          "mid1":"3256634642",
          "mid2":"2353252367",
          "mid3":"3245235236",
          "mid4":"6346347623",
          "mid5":"7345232424"
        }
      },
    ]
 */
turbo.queryUser().then((data) => {

});
```

#### 2.7 设置事件公共属性

对于所有事件都需要添加的属性，可在初始化 SDK 前，调用 `registerApp()` 将属性注册为公共属性：

```javascript
turbo.registerApp({
  test_register_app_key: "test_register_app_value",
});
```

> 📢 注意：公共属性需要先在 `引力引擎后台-->管理中心-->元数据-->事件属性`中添加，否则会上报失败。

#### 2.8 代码埋点追踪自定义事件

在文件顶部使用 import 引入 SDK 文件，然后调用 `track()` 方法，可以记录用户自定义事件。

```javascript
turbo.track("click", {
  $name: "点击",
});
```

---

### 3. 用户属性相关调用

#### 3.1 设置用户属性

`profileSet()` 方法可以设置用户属性，同一个 key 被多次设置时，value 的值会进行覆盖替换：

```javascript
// 若某key已存在则覆盖,否则将自动创建并赋值
turbo.profileSet({
  inviter_id: "your_id",
  role_level: 1,
  vip_level: 1,
  first_order_time: "2022-10-11 11:28:59",
  friends_num: 1,
  $name: "your_name",
  $gender: "female",
  $signup_time: "2022-10-11 11:28:59",
});
```

#### 3.2 记录初次设定的用户属性

对于只在首次设置时有效的属性，我们可以使用 `profileSetOnce()` 记录这些属性。与 `profileSet()` 方法不同的是，如果被设置的用户属性已存在，则这条记录会被忽略而不会覆盖已有数据，如果属性不存在则会自动创建。因此，`profileSetOnce()` 适用于为用户设置首次激活时间、首次注册时间等属性。例如：

```javascript
turbo.profileSetOnce({
  $first_visit_time: "2022-10-11 11:28:59",
});
```

#### 3.3 数值类型的属性

对于数值型的用户属性，可以使用 `profileIncrement()` 对属性值进行累加。常用于记录用户付费次数、付费额度、积分等属性。例如：

```javascript
// 增加或减少一个用户的某个NUMBER类型的Profile值
turbo.profileIncrement({
  friends_num: 2,
});
```

#### 3.4 列表类型的属性

对于用户喜爱的电影、用户点评过的餐厅等属性，可以记录列表型属性，例如：

```javascript
// 向某个用户的某个数组类型的Profile添加一个或者多个值,默认不去重
turbo.profileAppend({
  Movies: ["Interstellar", "The Negro Motorist Green Book"],
});
```

#### 3.5 用户属性的删除

调用 `profileDelete()`方法，讲把当前用户属性清空

```javascript
// // 删除一个用户的整个 Profile
turbo.profileDelete();
```

#### 3.6 属性取消

如果需要取消已设置的某个用户属性，可以调用 `profileUnset()`进行取消：

```javascript
// 将某个用户的某些属性值设置为空
turbo.profileUnset("age");
```

#### License

Under BSD license，you can check out the license file
