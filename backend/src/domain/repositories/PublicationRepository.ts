import { PublicationFilterDTO } from '@/application/dtos/PublicationDTO';
import { Publication } from '../entities/Publication';

export interface PublicationRepository {
    findById(id: string): Promise<Publication | null>;
    findAll(): Promise<Publication[]>;
    save(publication: Publication): Promise<Publication>;
    update(publication: Publication): Promise<Publication>;
    delete(id: string): Promise<boolean>;
    find(filters: PublicationFilterDTO): Promise<Publication[]>;
}

