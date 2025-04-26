import { mockedPublications } from "../helpers/fixture";
import BaseApi from "./baseApi";

class MagicCardsApi extends BaseApi {
    constructor() {
        super({ resource: "" })
    }

    getPublications(queryParams){
        //TODO: PASS USER TOKEN AS HEADER.
        //return this.get("/publications", queryParams); 
        return Promise.resolve(mockedPublications);
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