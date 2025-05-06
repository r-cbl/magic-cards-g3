import { GetAllGamesClient } from "./getAllGames.client"
import { CreateRequest } from "./request/create.request"
import { GetRequest } from "./request/get.request"
import { GameResponse } from "./response/game.response"
import { CreateGameClient } from "./createGame.client"

export class GamesClient {
    createClient = new CreateGameClient()
    getAllClient = new GetAllGamesClient()
    // getByIdClient = new GetByIdCardClient()
    // updateClient = new UpdateCardClient()
    // deleteClient = new DeleteCardClient() 

    create(request: CreateRequest, token: string): Promise<GameResponse> {
        return this.createClient.execute(request, token);
    }

    getAll(request: GetRequest, token: string): Promise<PaginatedResponse<GameResponse>> {
        let response = this.getAllClient.execute(request, token)
        // console.log(JSON.stringify(response));            // en una única línea
        return response;
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