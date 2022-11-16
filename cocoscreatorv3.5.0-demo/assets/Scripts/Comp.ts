import { _decorator, Component } from "cc";
import turbo from "./turbo.min.js";
const { ccclass } = _decorator;

@ccclass("Demo")
export class Demo extends Component {
  start() {
    turbo.setPara({
      autoTrack: {
        appLaunch: true,
        appShow: true,
        appHide: true,
      },
      show_log: true,
    });
    turbo.init("gZGljPsq7I4wc3BMvkAUsevQznx1jahi", "your_client_id");
  }

  update(deltaTime: number) {}

  handleRegister() {
    turbo
      .register({
        name: "your_name",
        channel: "your_channel",
        version: 123,
        click_id: "your_click_id",
        wx_openid: "your_wx_openid",
        wx_unionid: "your_wx_unionid",
      })
      .then((res) => {
        console.log(res);
      });
  }

  handleEvent() {
    turbo.handleEvent({
        event_type: "pay",
        properties: {
          amount: 100,
          real_amount: 200,
        },
        timestamp: 1000,
      })
      .then((res) => {
        console.log(res);
      });
  }

  handleQueryUser() {
    turbo.queryUser().then((res) => {
      console.log(res);
    });
  }

  handleProfileSet() {
    turbo.profileSet({
      $first_visit_time: "2022-09-10 11:12:13",
      friends_num: 1,
      arr: [1, 2],
      $name: "bob",
      $gender: "female",
      $signup_time: "2022-09-10 11:12:13",
    });
  }

  handleProfileSetOnce() {
    turbo.profileSetOnce({
      $first_visit_time: "2022-09-10 11:12:13",
    });
  }

  handleProfileIncrement() {
    turbo.profileIncrement({
      friends_num: 2,
    });
  }

  handleProfileDelete() {
    turbo.profileDelete();
  }

  handleProfileAppend() {
    turbo.profileAppend({
      arr: [3, 4],
    });
  }

  handleProfileUnset() {
    turbo.profileUnset("arr");
  }

  handleRegisterApp() {
    turbo.registerApp({
      test_register_app_key: "test_register_app_value",
    });
  }

  handleRegisterEvent() {
    turbo.registerEvent();
  }

  handleLoginEvent() {
    turbo.loginEvent();
  }

  handleLogoutEvent() {
    turbo.logoutEvent();
  }

  handleCustomTrack() {
    turbo.track("test", {
      $pay_type: "rmb",
    });
  }
}
