import { Game } from "../entities/Game";
import { PaginatedResponseDTO, PaginationDTO } from "@/application/dtos/PaginationDTO";
import {GameFilterDTO} from "../../application/dtos/GameDTO";

export interface GameRepository {
    save(game: Game): Promise<Game>;
    update(game: Game): Promise<Game>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Game | undefined>;
    findAll(): Promise<Game[]>;
    findPaginated(filters: PaginationDTO<GameFilterDTO>): Promise<PaginatedResponseDTO<Game>>;
} 