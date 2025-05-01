import { Request, Response } from 'express';
import { CardBaseService } from '../../application/services/CardBaseService';
import { CardBaseFilterDTO, CreateCardBaseDTO, UpdateCardBaseDTO } from '../../application/dtos/CardBaseDTO';
import { PaginationDTO } from '../../application/dtos/PaginationDTO';

export class CardBaseController {
  constructor(private readonly cardBaseService: CardBaseService) {}

  public async createCardBase(req: Request, res: Response): Promise<void> {
    try {
      const cardBaseData: CreateCardBaseDTO = req.body;
      const cardBase = await this.cardBaseService.createCardBase(cardBaseData);
      res.status(201).json(cardBase);
    } catch (error) {
      if (error instanceof Error && error.message === 'Game not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async getCardBase(req: Request, res: Response): Promise<void> {
    try {
      const cardBaseId = req.params.id;
      const cardBase = await this.cardBaseService.getCardBase(cardBaseId);
      res.status(200).json(cardBase);
    } catch (error) {
      if (error instanceof Error && error.message === 'CardBase not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async getAllCardBases(req: Request, res: Response): Promise<void> {
    try {
      const gameId = req.query.gameId as string | undefined;
      const cardBases = await this.cardBaseService.getAllCardBases(gameId);
      res.status(200).json(cardBases);
    } catch (error) {
      if (error instanceof Error && error.message === 'Game not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async getAllCardBasesPaginated(req: Request, res: Response): Promise<void> {
    try {
        const filters: PaginationDTO<CardBaseFilterDTO> = {
            data: {
                nameCard: req.query.name ? (req.query.name as string) : undefined,
                gameId: req.query.game ? (req.query.game as string) : undefined,
            },
            limit: req.query.limit ? Number(req.query.limit) : undefined,
            offset: req.query.offset ? Number(req.query.offset) : undefined,
        };

        const cards = await this.cardBaseService.getAllCardBasesPaginated(filters);
        res.status(200).json(cards);
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

  public async updateCardBase(req: Request, res: Response): Promise<void> {
    try {
      const cardBaseId = req.params.id;
      const cardBaseData: UpdateCardBaseDTO = req.body;
      const cardBase = await this.cardBaseService.updateCardBase(cardBaseId, cardBaseData);
      res.status(200).json(cardBase);
    } catch (error) {
      if (error instanceof Error && (error.message === 'CardBase not found' || error.message === 'Game not found')) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }

  public async deleteCardBase(req: Request, res: Response): Promise<void> {
    try {
      const cardBaseId = req.params.id;
      await this.cardBaseService.deleteCardBase(cardBaseId);
      res.status(204).send();
    } catch (error) {
      if (error instanceof Error && error.message === 'CardBase not found') {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unexpected error occurred' });
      }
    }
  }
} 