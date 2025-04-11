import { Publication } from "@/domain/entities/Publication";
import { PublicationRepository } from "@/domain/repositories/PublicationRepository";

export class InMemoryPublicationRepository implements PublicationRepository {
    private publications: Map<string, Publication> = new Map();

    async findById(id: string): Promise<Publication | null> {
        const publication = this.publications.get(id);
        return publication || null;
    }
    async findAll(): Promise<Publication[]> {
        return Array.from(this.publications.values());
    }
    async save(publication: Publication): Promise<Publication> {
        this.publications.set(publication.getId(), publication);
        return publication;
    }
    async update(publication: Publication): Promise<Publication> {
        this.publications.set(publication.getId(), publication);
        return publication;
    }
    async delete(id: string): Promise<boolean> {
        return this.publications.delete(id)
    }
}


