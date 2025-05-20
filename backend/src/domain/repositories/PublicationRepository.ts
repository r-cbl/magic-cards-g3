import { PublicationFilterDTO } from '@/application/dtos/PublicationDTO';
import { Publication } from '../entities/Publication';
import { PaginatedResponseDTO } from '@/application/dtos/PaginationDTO';

export interface PublicationRepository {
    findById(id: string): Promise<Publication | null>;
    findAll(): Promise<Publication[]>;
    save(publication: Publication): Promise<Publication>;
    update(publication: Publication): Promise<Publication>;
    delete(id: string): Promise<boolean>;
    find(filters: PublicationFilterDTO): Promise<Publication[]>;
    findPaginated(filters: PublicationFilterDTO): Promise<PaginatedResponseDTO<Publication>>;
}

