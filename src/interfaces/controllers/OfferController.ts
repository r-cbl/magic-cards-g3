import { Request, Response } from 'express';
import { OfferService} from '../../application/services/OfferService';
import { CreateOfferDTO } from '@/application/dtos/OfferDTO';

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
            if (error instanceof Error) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getAllOffers(req: Request, res: Response): Promise<void> {
        try {
            const offers = await this.offerService.getAllOffers();
            res.status(200).json(offers);
        } catch (error) {
            res.status(500).json({ error: 'An unexpected error occurred' });
        }
    }

    public async getOffer(req: Request, res: Response): Promise<void> {
        
        res.status(500).json({ error: 'An unexpected error occurred' });
    }

    public async updateOffer(req: Request, res: Response): Promise<void> {
        
        res.status(500).json({ error: 'An unexpected error occurred' });    
        
    }

    public async deleteOffer(req: Request, res: Response): Promise<void> {
        res.status(500).json({ error: 'An unexpected error occurred' });
        
    }
}