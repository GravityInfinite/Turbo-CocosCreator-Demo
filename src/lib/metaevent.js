import turbo from "../index";
import { setQuery } from "../utils/tools";

let mpshow_time = new Date().getTime();
export const autoTrackCustom = {
  appLaunch: function (option) {
    if (!turbo?._para?.autoTrack?.appLaunch) {
      return;
    }
    turbo.track("$MPLaunch", {
      $url_query: setQuery(option.query),
      $scene: String(option.scene),
    });
  },
  appShow: function (option) {
    mpshow_time = new Date().getTime();
    turbo._current_scene = option.scene;
    if (!turbo?._para?.autoTrack?.appShow) {
      return;
    }
    let $url_path = undefined;
    try {
      if (location?.pathname) {
        $url_path = location.pathname;
      }
    } catch (e) {
      $url_path = undefined;
    }
    turbo.track("$MPShow", {
      $url_path,
      $url_query: setQuery(option.query),
      $scene: String(option.scene),
    });
  },
  appHide: function () {
    if (!turbo?._para?.autoTrack?.appHide) {
      return;
    }
    let $url_path = undefined;
    try {
      if (location?.pathname) {
        $url_path = location.pathname;
      }
    } catch (e) {
      $url_path = undefined;
    }
    let event_duration = null;
    const current_time = new Date().getTime();
    if (
      mpshow_time &&
      current_time - mpshow_time > 0 &&
      (current_time - mpshow_time) / 3600000 < 24
    ) {
      event_duration = current_time - mpshow_time;
    }
    turbo.track("$MPHide", {
      $url_path,
      $event_duration: event_duration / 1000,
    });
  },
};
