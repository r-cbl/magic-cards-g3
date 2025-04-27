import { CreatePublicationClient } from "./createPublication.client";
import { DeletePublicationClient } from "./deletePublication.client";
import { GetAllPublicationClient } from "./getAllPublications.client";
import { GetByIdPublicationClient } from "./getPublicationByID.client";
import { CreateRequest } from "./request/create.request";
import { GetRequest } from "./request/get.request";
import { UpdateRequest } from "./request/update.request";
import { PublicationResponse } from "./response/publication.response";
import { UpdatePublicationClient } from "./updatePublication.client";

export class PublicationsClient {
    
    createClient = new CreatePublicationClient()
    getAllClient = new GetAllPublicationClient()
    getByIdClient = new GetByIdPublicationClient()
    updateClient = new UpdatePublicationClient()
    deleteClient = new DeletePublicationClient() 

    create(request: CreateRequest, token: string): Promise<PublicationResponse> {
        return this.createClient.execute(request, token);
    }

    getAll(request: GetRequest, token: string): Promise<PublicationResponse> {
        return this.getAllClient.execute(request, token);
    }

    getById(request: string, token: string): Promise<PublicationResponse> {
        return this.getByIdClient.execute(request, token);
    }

    update(request: UpdateRequest, token: string): Promise<PublicationResponse> {
        return this.updateClient.execute(request, token);
    }

    delete(request: string, token: string): Promise<void> {
       return this.deleteClient.execute(request,token);
    }




}