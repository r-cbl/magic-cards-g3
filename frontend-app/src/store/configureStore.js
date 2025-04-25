import { init } from "@rematch/core";
import loadingPlugin from "@rematch/loading";
import { reducer as formReducer } from "redux-form";
import { createReduxHistoryContext } from "redux-first-history";
import models from "../models/index.js";
import { createBrowserHistory } from "history";

/*
 * @param {Object} initial state to bootstrap our stores with for server-side rendering
 * @param {History Object} a history object. We use `createMemoryHistory` for server-side rendering,
 *                          while using browserHistory for client-side
 *                          rendering.
 */
export default function configureStore(initialState, history) {

  const browserHistory = history ?? createBrowserHistory();
  const { createReduxHistory, routerMiddleware, routerReducer } = createReduxHistoryContext({ history: browserHistory });

  const form = formReducer.plugin({});
  const reducers = { router: routerReducer, form };

  const store = init({
    models,
    redux: {
      initialState,
      reducers,
      middlewares: [routerMiddleware],
    },
    plugins: [loadingPlugin()],
  });
  const reduxHistory = createReduxHistory(store);
  return { store, history: reduxHistory };
}