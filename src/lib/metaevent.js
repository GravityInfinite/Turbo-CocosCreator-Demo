import turbo from "../index";
import { setQuery } from "../utils/tools";

let mpshow_time = new Date().getTime();
export const autoTrackCustom = {
  appLaunch: function (option) {
    if (!turbo?._para?.autoTrack?.appLaunch) {
      return;
    }
    turbo.track("$MPLaunch", {
      $is_first_time: turbo._is_first_launch,
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
    turbo.track("$MPShow", {
      $url_query: setQuery(option.query),
      $scene: String(option.scene),
    });
  },
  appHide: function () {
    if (!turbo?._para?.autoTrack?.appHide) {
      return;
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
      $event_duration: event_duration,
    });
  },
};
