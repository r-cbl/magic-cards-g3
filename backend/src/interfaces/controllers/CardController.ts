import { CardFilterDTO, CardUpdatedDTO, CreateCardDTO } from '@/application/dtos/CardsDTO';
import { CardService } from '@/application/services/CardService';
import { Request, Response } from 'express';

export class CardController {
    constructor(private readonly cardService: CardService) {}

    public async createCard(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user?.userId;
            const cardData: CreateCardDTO = { 
                ...req.body,
                ownerId: userId,
            };
            const publication = await this.cardService.createCard(cardData);
            res.status(201).json(publication);
        } catch (error) {
            if (error instanceof Error) {
                res.status(400).json({ error: error.message }); 
            } else {
                res.status(500).json({ error: 'An unexpected error occurred' });
            }
        }
    }

    public async getAllCards(req: Request, res: Response): Promise<void> {
        try {

            const filters: CardFilterDTO = {
                name: req.query.name ? (req.query.name as string) : undefined,
                game: req.query.game ? (req.query.game as string) : undefined,
                ownerId: req.query.ownerId as string
            };
        
            const cards = await this.cardService.getAllCards(filters);
            res.status(200).json(cards);
        } catch (error) {
          if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(500).json({ error: 'An unexpected error occurred' });
          }
        }
    }
      

    public async getCard(req: Request, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const card = await this.cardService.getCard(id)
            res.status(200).json(card)
        } catch (error) {
            if (error instanceof Error) {
              res.status(400).json({ error: error.message });
            } else {
              res.status(500).json({ error: 'An unexpected error occurred' });
            }
          }   
    }

    public async updateCard(req: Request, res: Response): Promise<void> {
        try {
            const ownerId = req.user!.userId;
            const id = req.params.id;
            const cardData : CardUpdatedDTO = {
                ...req.body,
                ownerId
            }
            const card = await this.cardService.updateCard(id, cardData);
            res.status(200).json(card);
        } catch (error) {
            if (error instanceof Error) {
              res.status(400).json({ error: error.message });
            } else {
              res.status(500).json({ error: 'An unexpected error occurred' });
            }
          }   
    }

    public async deleteCard(req: Request, res: Response): Promise<void> {
        try {
            const userId = req.user!.userId;
            const id = req.params.id;
            await this.cardService.deleteCard(userId, id)
            res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
              res.status(400).json({ error: error.message });
            } else {
              res.status(500).json({ error: 'An unexpected error occurred' });
            }
          }   
    }
}


