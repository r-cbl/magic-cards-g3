import { Game } from "../../domain/entities/Game";
import { GameRepository } from "../../domain/repositories/GameRepository";

export class InMemoryGameRepository implements GameRepository {
    private games: Game[] = [];

    async save(game: Game): Promise<Game> {
        this.games.push(game);
        return game;
    }
    
    async update(game: Game): Promise<Game> {
        const index = this.games.findIndex(g => g.getId() === game.getId());
        if (index === -1) {
            throw new Error('Game not found');
        }
        this.games[index] = game;
        return game;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.games.findIndex(g => g.getId() === id);
        if (index === -1) {
            return false;
        }
        this.games.splice(index, 1);
        return true;
    }   

    async findById(id: string): Promise<Game | undefined> {
        return this.games.find(g => g.getId() === id) || undefined;
    }
    
    async findAll(): Promise<Game[]> {
        return [...this.games];
    }
} 