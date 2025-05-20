import { Request, Response } from 'express';
import { CreatePublicationDTO, PublicationFilterDTO, PublicationUpdatedDTO } from "../../application/dtos/PublicationDTO";
import { PublicationService } from "../../application/services/PublicationService";
import { UnauthorizedException } from '../../domain/entities/exceptions/exceptions';
import { PaginationDTO } from '@/application/dtos/PaginationDTO';

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
            if (error instanceof UnauthorizedException) {
                res.status(401).json({ error: error.message }); 
            } else if (error instanceof Error) {
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
                status: req.query.status ? (req.query.status as string) : undefined,
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
          if (error instanceof UnauthorizedException) {
            res.status(401).json({ error: error.message });
          } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
          }
        }
    }

    public async getAllPublicationsPaginated(req: Request, res: Response): Promise<void> {
        try {
            const filters: PaginationDTO<PublicationFilterDTO> = {
                data: {
                    initialDate: req.query.initialDate ? new Date(req.query.initialDate as string) : undefined,
                    endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
                    gamesIds: req.query.gamesIds ? (req.query.gamesIds as string).split(',') : undefined,
                    cardBaseIds: req.query.cardBaseIds ? (req.query.cardBaseIds as string).split(',') : undefined,
                    ownerId: req.query.ownerId ? (req.query.ownerId as string) : undefined,
                    minValue: req.query.minValue ? Number(req.query.minValue) : undefined,
                    maxValue: req.query.maxValue ? Number(req.query.maxValue) : undefined,
                    excludeId: req.query.excludeId ? (req.query.excludeId as string) : undefined,
                    status: req.query.status ? (req.query.status as string) : undefined,
                },
                limit: req.query.limit ? Number(req.query.limit) : undefined,
                offset: req.query.offset ? Number(req.query.offset) : undefined,
            };

            const publications = await this.publicationService.getAllPublicationsPaginated(filters);
            res.status(200).json(publications);
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

    public async getPublication(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const publication = await this.publicationService.getPublication(id)
            res.status(200).json(publication)
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

    public async updatePublication(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const id = req.params.id;
            const publicationData : PublicationUpdatedDTO = {
                ...req.body,
                userId
            }
            const publication = await this.publicationService.updatePublication(id, publicationData)
            res.status(200).json(publication)
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

    public async deletePublication(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const id = req.params.id;
            await this.publicationService.deletePublication(userId,id)
            res.status(204).send();
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
}


