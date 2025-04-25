import { dispatchWithLoading, dispatchWithAlert } from "../utils/withNoResultsView.jsx";

export default {

  state: {
    item: {},
  },
  reducers: {
    set: (state, payload) => ({
      ...state,
      item: payload,
    }),
  },
  effects: (dispatch) => ({
    fetch(data) {
    },

    create(secret, _rootState, { executeCaptcha }) {
    },

    delete(id) {},
  }),
};