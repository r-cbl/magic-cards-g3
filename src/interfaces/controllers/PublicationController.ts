import { Request, Response } from 'express';
import { CreatePublicationDTO, PublicationFilterDTO } from "../../application/dtos/PublicationDTO";
import { PublicationService } from "../../application/services/PublicationService";

export class PublicationController {
    constructor(private readonly publicationService: PublicationService) {}

    public async createPublication(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const publicationData: CreatePublicationDTO = { 
                ...req.body,
                ownerId: userId,
            };
            const publication = await this.publicationService.createPublication(publicationData);
            res.status(201).json(publication);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message }); 
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getAllPublications(req: Request, res: Response): Promise<void> {
        try {

            const filters: PublicationFilterDTO = {
                gamesIds: req.query.gamesIds ? (req.query.gamesIds as string).split(',') : undefined,
                cardBaseIds: req.query.cardBaseIds ? (req.query.cardBaseIds as string).split(',') : undefined,              
                ownerId: (req.query.ownerId as string) || undefined,
                initialDate: req.query.initialDate ? new Date(req.query.initialDate as string) : undefined,
                endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                minValue: req.query.minValue ? Number(req.query.minValue) : undefined,
                maxValue: req.query.maxValue ? Number(req.query.maxValue) : undefined,
            };
        
            const publications = await this.publicationService.getAllPublications(filters);
            res.status(200).json(publications);
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
          }
        }
    }
      

    public async getPublication(req: Request, res: Response): Promise<void> {
        
    }

    public async updatePublication(req: Request, res: Response): Promise<void> {
        
    }

    public async deletePublication(req: Request, res: Response): Promise<void> {
        
    }
}


