import { Request, Response } from 'express';
import { OfferService} from '../../application/services/OfferService';
import { CreateOfferDTO, OfferFilterDTO, OfferUpdatedDTO } from '../../application/dtos/OfferDTO';
import { UnauthorizedException } from '../../domain/entities/exceptions/exceptions';
import { PaginationDTO } from '@/application/dtos/PaginationDTO';
import { Offer } from '@/domain/entities/Offer';

export class OfferController {
    constructor(private readonly offerService: OfferService) {}

    public async createOffer(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const offerData: CreateOfferDTO = {
                ...req.body,
                offerOwnerId: userId,   
            };
            const offer = await this.offerService.createOffer(offerData);
            res.status(201).json(offer);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getAllOffers(req: Request, res: Response): Promise<void> {
        try {
            const filters: OfferFilterDTO = {
                ownerId: req.query.ownerId ? (req.query.ownerId as string) : undefined,
                publicationId: req.query.publicationId ? (req.query.publicationId as string) : undefined,
                status: req.query.status ? (req.query.status as string) : undefined,
            };

            const offers = await this.offerService.getAllOffer(filters);
            res.status(200).json(offers);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getAllOffersPaginated(req: Request, res: Response): Promise<void> {
        try {
            const filters: PaginationDTO<OfferFilterDTO> = {
                data: {
                    ownerId: req.query.ownerId ? (req.query.ownerId as string) : undefined,
                    publicationId: req.query.publicationId ? (req.query.publicationId as string) : undefined,
                    status: req.query.status ? (req.query.status as string) : undefined,
                },
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                offset: req.query.offset ? Number(req.query.offset) : undefined,
            };

            const offers = await this.offerService.getAllOfferPaginated(filters);
            res.status(200).json(offers);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getOffer(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const offer = await this.offerService.getOffer(id);
            if (offer) {
                res.status(200).json(offer);
            } else {
                res.status(404).json({ error: 'Offer not found' });
            }
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async updateOffer(req: Request, res: Response): Promise<void> {
        try{
            const id = req.params.id;
            const userId = req.user?.userId;
            const offerData: OfferUpdatedDTO = {
                ...req.body,
                userId: userId,   
            };
            const offer = await this.offerService.updateOffer(id, offerData);
            res.status(200).json(offer);
        } catch (error) {
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message });
            } else if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }   
        
    }

    public async deleteOffer(req: Request, res: Response): Promise<void> {
        res.status(500).json({ error: 'An unexpected error occurred' });
        
    }
}