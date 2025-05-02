import { CreateBaseCardClient } from "./createBaseCard.client"
import { GetAllBaseCardsClient } from "./getAllBaseCards.client"
import { CreateRequest } from "./request/create.request"
import { GetRequest } from "./request/get.request"
import { BaseCardResponse } from "./response/baseCard.response"

export class BaseCardsClient {
    createClient = new CreateBaseCardClient()
    getAllClient = new GetAllBaseCardsClient()
    // getByIdClient = new GetByIdCardClient()
    // updateClient = new UpdateCardClient()
    // deleteClient = new DeleteCardClient() 

    create(request: CreateRequest, token: string): Promise<BaseCardResponse> {
        return this.createClient.execute(request, token);
    }

    getAll(request: GetRequest, token: string): Promise<PaginatedResponse<BaseCardResponse>> {
        return this.getAllClient.execute(request,token);
    }
    

    // getById(request: string, token: string): Promise<CardResponse> {
    //     return this.getByIdClient.execute(request, token);
    // }

    // update(request: UpdateRequest, token: string): Promise<CardResponse> {
    //     return this.updateClient.execute(request, token);
    // }

    // delete(request: string, token: string): Promise<void> {
    //    return this.deleteClient.execute(request,token);
    // }
}