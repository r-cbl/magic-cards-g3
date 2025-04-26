import { CreatePublicationClient } from "./create.client";
import { GetAllPublicationClient } from "./getAll.client";
import { GetByIdPublicationClient } from "./getByID.client";
import { CreateRequest } from "./request/create.request";
import { GetRequest } from "./request/get.request";
import { PublicationResponse } from "./response/publication.response";

export class PublicationsClient {
    
    createClient = new CreatePublicationClient()
    getAllClient = new GetAllPublicationClient()
    getByIdClientt = new GetByIdPublicationClient()

    create(request: CreateRequest, token: string): Promise<PublicationResponse> {
        return this.createClient.execute(request, token);
    }

    getAll(request: GetRequest, token: string): Promise<PublicationResponse> {
        return this.getAllClient.execute(request, token);
    }

    getById(request: string, token: string): Promise<PublicationResponse> {
        return this.getById(request, token);
    }


}