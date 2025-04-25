import { routerMiddleware } from "react-router-redux";
import reactRouterModel from "./model";

export const createReactRouterPlugin = (browserHistory) => () => {
  const middleware = routerMiddleware(browserHistory);

  return {
    middleware,
    config: {
      models: {
        router: reactRouterModel,
      },
    },
    onStoreCreated() {
      return {
        browserHistory,
      };
    },
  };
};