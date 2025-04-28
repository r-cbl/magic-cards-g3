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
        let page: PaginatedResponse<BaseCardResponse>;
    
 //       if (request.offset === 0) {
            page = {
                data: [
                    // {
                    //     id: "basecard-0-1",
                    //     game: {
                    //         id: "game-0-1",
                    //         name: "Mock Game 0-1",
                    //         createdAt: new Date(),
                    //         updatedAt: new Date()
                    //     },
                    //     nameCard: "Pikachu",
                    //     createdAt: new Date(),
                    //     updatedAt: new Date()
                    // },
                    // {
                    //     id: "basecard-0-2",
                    //     game: {
                    //         id: "game-0-1",
                    //         name: "Mock Game 0-1",
                    //         createdAt: new Date(),
                    //         updatedAt: new Date()
                    //     },
                    //     nameCard: "Charmander",
                    //     createdAt: new Date(),
                    //     updatedAt: new Date()
                    // }
                ],
                total: 4,
                limit: request.limit,
                offset: 0,
                hasMore: true,
            };
        // } else {
        //     page = {
        //         data: [
        //             {
        //                 id: "basecard-1-1",
        //                 game: {
        //                     id: "game-0-1",
        //                     name: "Mock Game 0-1",
        //                     createdAt: new Date(),
        //                     updatedAt: new Date()
        //                 },
        //                 nameCard: "Bulbasaur",
        //                 createdAt: new Date(),
        //                 updatedAt: new Date()
        //             },
        //             {
        //                 id: "basecard-1-2",
        //                 game: {
        //                     id: "game-0-1",
        //                     name: "Mock Game 0-1",
        //                     createdAt: new Date(),
        //                     updatedAt: new Date()
        //                 },
        //                 nameCard: "Squirtle",
        //                 createdAt: new Date(),
        //                 updatedAt: new Date()
        //             }
        //         ],
        //         total: 4,
        //         limit: request.limit,
        //         offset: request.limit,
        //         hasMore: false,
        //     };
        // }
    
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