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

        let page: PaginatedResponse<GameResponse>;

        if (request.offset === 0) {
          page = {
            data: [
              {
                id: "game-0-1",
                name:"Mock Game 0-1"
              },
              {
                id: "game-0-2",
                name:"Mock Game 0-2"
              },
            ],
            total: 4,
            limit: request.limit,
            offset: 0,
            hasMore: true,
          };
        } else {
          page = {
            data: [
                {
                    id: "game-1-1",
                    name:"Mock Game 1-1"
                  },
                  {
                    id: "game-1-2",
                    name:"Mock Game 1-2"
                  },
            ],
            total: 4,
            limit: request.limit,
            offset: request.limit,
            hasMore: false,
          };
        }
    
        return Promise.resolve(page);
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