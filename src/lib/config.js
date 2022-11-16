export const header = {
  "content-type": "application/json",
};

export const batch_send_default = {
  send_timeout: 10 * 1000, // 定时上报间隔
  max_length: 10, // event_list最大缓存条数
};
