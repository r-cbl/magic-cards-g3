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
      return magicCardsApi.getPublications(params).then(this.setPublications);
    }
  }),
};