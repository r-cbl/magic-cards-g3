import { bindActionCreators } from "redux";
import { routerReducer, push, replace, go, goBack, goForward } from "react-router-redux";

export default {
  baseReducer: routerReducer,
  effects: (dispatch) =>
    bindActionCreators(
      {
        push,
        replace,
        go,
        goBack,
        goForward,
      },
      dispatch
    ),
};