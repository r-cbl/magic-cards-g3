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
    update(publication: Publication): Promise<Publication> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
}


