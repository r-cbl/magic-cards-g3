import { CreateOfferClient } from "./createOffer.client";
import { DeleteOfferClient } from "./deletePublication.client";
import { GetAllOffersClient } from "./getAllPublications.client";
import { GetByIdOfferClient } from "./getPublicationByID.client";
import { CreateRequest } from "./request/create.request";
import { GetRequest } from "./request/get.request";
import { UpdateRequest } from "./request/update.request";
import { OfferResponse } from "./response/offer.response";
import { UpdateOfferClient } from "./updatePublication.client";

export class OffersClient {
    
    createClient = new CreateOfferClient()
    getAllClient = new GetAllOffersClient()
    getByIdClient = new GetByIdOfferClient()
    updateClient = new UpdateOfferClient()
    deleteClient = new DeleteOfferClient() 

    create(request: CreateRequest, token: string): Promise<OfferResponse> {
        return this.createClient.execute(request, token);
    }

    getAll(request: GetRequest, token: string): Promise<PaginatedResponse<OfferResponse>> {
        return this.getAllClient.execute(request, token);
    }

    getById(request: string, token: string): Promise<OfferResponse> {
        return this.getByIdClient.execute(request, token);
    }

    update(request: UpdateRequest, token: string): Promise<OfferResponse> {
        return this.updateClient.execute(request, token);
    }

    delete(request: string, token: string): Promise<void> {
       return this.deleteClient.execute(request,token);
    }
}