import { CreateCardClient } from "./createCard.client"
import { DeleteCardClient } from "./deleteCard.client"
import { GetAllCardsClient } from "./getAllCards.client"
import { GetByIdCardClient } from "./getCardById.client"
import { CreateRequest } from "./request/create.request"
import { GetRequest } from "./request/get.request"
import { UpdateRequest } from "./request/update.request"
import { CardResponse } from "./response/card.response"
import { UpdateCardClient } from "./updateCard.client"

export class CardsClient {
    createClient = new CreateCardClient()
    getAllClient = new GetAllCardsClient()
    getByIdClient = new GetByIdCardClient()
    updateClient = new UpdateCardClient()
    deleteClient = new DeleteCardClient() 

    create(request: CreateRequest, token: string): Promise<CardResponse> {
        return this.createClient.execute(request, token);
    }

    getAll(request: GetRequest, token: string): Promise<PaginatedResponse<CardResponse>> {
        return this.getAllClient.execute(request, token);
    }

    getById(request: string, token: string): Promise<CardResponse> {
        return this.getByIdClient.execute(request, token);
    }

    update(request: UpdateRequest, token: string): Promise<CardResponse> {
        return this.updateClient.execute(request, token);
    }

    delete(request: string, token: string): Promise<void> {
       return this.deleteClient.execute(request,token);
    }
}