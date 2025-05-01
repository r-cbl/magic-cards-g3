import { Game } from "../entities/Game";
import { PaginatedResponseDTO, PaginationDTO } from "@/application/dtos/PaginationDTO";

export interface GameRepository {
    save(game: Game): Promise<Game>;
    update(game: Game): Promise<Game>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Game | undefined>;
    findAll(): Promise<Game[]>;
    findPaginated(filters: PaginationDTO<String | undefined>): Promise<PaginatedResponseDTO<Game>>;
} 