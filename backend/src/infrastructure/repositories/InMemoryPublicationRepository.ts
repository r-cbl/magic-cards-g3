import { Publication } from "@/domain/entities/Publication";
import { PublicationRepository } from "@/domain/repositories/PublicationRepository";
import { PublicationFilterDTO } from "@/application/dtos/PublicationDTO";
import { PaginatedResponseDTO, PaginationDTO } from "@/application/dtos/PaginationDTO";

export class InMemoryPublicationRepository implements PublicationRepository {
    private publications: Publication[] = [];

    async findById(id: string): Promise<Publication | null> {
        const publication = this.publications.find(p => p.getId() === id);
        if (!publication) {
            throw new Error('Publication not found');
        }
        return publication;
    }

    async findAll(): Promise<Publication[]> {
        return Array.from(this.publications.values());
    }

    async save(publication: Publication): Promise<Publication> {
        const exists = this.publications.find(p => p.getId() === publication.getId());
        if (exists) {
          throw new Error(`Publication with ID '${publication.getId()}' already exists`);
        }
      
        this.publications.push(publication);
        return publication;
    }

    async find(filters: PublicationFilterDTO): Promise<Publication[]> {
        return this.publications.filter(pub => {
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


    async findPaginated(filters: PaginationDTO<PublicationFilterDTO>): Promise<PaginatedResponseDTO<Publication>> {
        const filterPublications = await this.find(filters.data);
        const limit = filters.limit || 10;
        const offset = filters.offset || 0;
        const total = filterPublications.length;
        const paginatedPublications = filterPublications.slice(offset, offset + limit);
        const hasMore = offset + limit < total;

        return {
            data: paginatedPublications,
            total,
            limit,
            offset,
            hasMore
        };
    }

    async update(publication: Publication): Promise<Publication> {
        const index = this.publications.findIndex(p => p.getId() === publication.getId());
        if (index === -1) {
            throw new Error('Publication not found');
        }
        this.publications[index] = publication;
        return publication;
    }
    
    async delete(id: string): Promise<boolean> {
        const index = this.publications.findIndex(p => p.getId() === id);
        if (index === -1) {
            return false;
        }
        this.publications.splice(index, 1);
        return true;    
    }
}


