import { dispatchWithLoading, dispatchWithAlert } from "../utils/withNoResultsView.jsx";
import magicCardsApi from "../services/magicCardsApi.js"

export default {

  state: {
    item: {},
    publications: []
  },
  reducers: {
    set: (state, payload) => ({
      ...state,
      item: payload,
    }),
    setPublications: (state, publications) => ({
      ...state,
      publications: publications
    })
  },
  effects: (dispatch) => ({
    fetchAllPublications(params){
      const request = () => magicCardsApi.getPublications(params).then(this.setPublications);
      return dispatchWithLoading(dispatch, request);
    }
  }),
};