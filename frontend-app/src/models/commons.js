import _ from "lodash";
import Promise from "bluebird";

export const isLoading = {
  state: false,
  reducers: {
    loading: _.constant(true),
    doneLoading: _.constant(false),
  },
};

const DEFAULT_ALERT = { message: "", type: "success", extras: null };
export const alert = {
  state: DEFAULT_ALERT,
  reducers: {
    showAlert: (state, payload) => payload,
    closeAlert: _.constant(DEFAULT_ALERT),
  },
  effects: {
    show(payload) {
      this.showAlert(payload);
      return Promise.delay(1000).tap(() => this.closeAlert());
    },
  },
};