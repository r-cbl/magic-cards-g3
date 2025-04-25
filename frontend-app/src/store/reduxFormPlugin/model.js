import { bindActionCreators } from "redux";
import { reducer, change, destroy, reset } from "redux-form";

export default {
  baseReducer: reducer,
  effects: (dispatch) =>
    bindActionCreators(
      {
        change,
        destroy,
        reset,
      },
      dispatch
    ),
};