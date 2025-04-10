import { Publication } from "@/domain/entities/Publication";
import { PublicationRepository } from "@/domain/repositories/PublicationRepository";

export class InMemoryPublicationRepository implements PublicationRepository {
    private publications: Map<string, Publication> = new Map();

    findById(id: string): Promise<Publication | null> {
        throw new Error("Method not implemented.");
    }
    findAll(): Promise<Publication[]> {
        throw new Error("Method not implemented.");
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


