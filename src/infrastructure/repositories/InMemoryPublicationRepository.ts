import { Publication } from "@/domain/entities/Publication";
import { PublicationRepository } from "@/domain/repositories/PublicationRepository";
import { PublicationFilterDTO } from "@/application/dtos/PublicationDTO";

export class InMemoryPublicationRepository implements PublicationRepository {
    private publications: Map<string, Publication> = new Map();

    findById(id: string): Promise<Publication | null> {
        throw new Error("Method not implemented.");
    }
    async findAll(): Promise<Publication[]> {
        return Array.from(this.publications.values());
    }
    async save(publication: Publication): Promise<Publication> {
        this.publications.set(publication.getId(), publication);
        return publication;
    }

    // TODO: Change this after enable bbdd settings.
    async find(filters: PublicationFilterDTO): Promise<Publication[]> {
        return Array.from(this.publications.values()).filter(pub => {
            const createdAt = pub.getCreatedAt();
            const ownerId = pub.getOwner().getId();
            const valueMoney = pub.getValueMoney() ?? 0;
            const gameId = pub.getCard().getCardBase().getGame().getId();
            const cardBaseId = pub.getCard().getCardBase().getId();

            return (
                (!filters.initialDate || createdAt >= filters.initialDate) &&
                (!filters.endDate || createdAt <= filters.endDate) &&
                (!filters.gamesIds || filters.gamesIds.includes(gameId)) &&
                (!filters.cardBaseIds || filters.cardBaseIds.includes(cardBaseId)) &&
                (!filters.minValue || valueMoney >= filters.minValue) &&
                (!filters.maxValue || valueMoney <= filters.maxValue) &&
                (!filters.ownerId || ownerId === filters.ownerId)
            );
        });
    }

    async update(publication: Publication): Promise<Publication> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}


