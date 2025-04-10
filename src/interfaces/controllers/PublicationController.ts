import { Request, Response } from 'express';
import { CreatePublicationDTO } from "../../application/dtos/PublicationDTO";
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
}


