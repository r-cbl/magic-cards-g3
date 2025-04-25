import BaseApi from "./baseApi";

class MagicCardsApi extends BaseApi {
    constructor() {
        super({ resource: "" })
    }

    getPublications(queryParams){
        return this.get("/publications", queryParams);
    }

    getPublication(id) {
        return this.get(`/publications/${id}`);
    }

    createPublication(publication) {
        return this.post("/publications", publication);
    }

    deletePublication(id) {
        return this.delete(`/publications/${id}`);
    }


}

export default new MagicCardsApi();