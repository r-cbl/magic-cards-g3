import { Game } from "../entities/Game";

export interface GameRepository {
    save(game: Game): Promise<Game>;
    update(game: Game): Promise<Game>;
    delete(id: string): Promise<boolean>;
    findById(id: string): Promise<Game | undefined>;
    findAll(): Promise<Game[]>;
} 