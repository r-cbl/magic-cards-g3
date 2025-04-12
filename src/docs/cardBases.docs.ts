/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCardBaseDTO:
 *       type: object
 *       required:
 *         - gameId
 *         - nameCard
 *       properties:
 *         gameId:
 *           type: string
 *           description: The ID of the associated game
 *           example: "game-abc123"
 *         nameCard:
 *           type: string
 *           description: The name of the card base
 *           example: "Black Lotus"
 *
 *     UpdateCardBaseDTO:
 *       type: object
 *       properties:
 *         gameId:
 *           type: string
 *           description: The ID of the associated game
 *           example: "game-abc123"
 *         nameCard:
 *           type: string
 *           description: The name of the card base
 *           example: "Black Lotus - Updated"
 *
 *     CardBaseResponseDTO:
 *       type: object
 *       required:
 *         - id
 *         - game
 *         - nameCard
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the card base
 *           example: "cb-abc123"
 *         game:
 *           $ref: '#/components/schemas/GameResponseDTO'
 *         nameCard:
 *           type: string
 *           description: The name of the card base
 *           example: "Black Lotus"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the card base was created
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the card base was last updated
 *           example: "2023-01-01T00:00:00.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: CardBases
 *   description: Card Base management API
 */

/**
 * @swagger
 * /card-bases:
 *   post:
 *     tags:
 *       - CardBases
 *     summary: Create a new card base
 *     description: Create a new card base with the provided name and associated game
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCardBaseDTO'
 *     responses:
 *       201:
 *         description: Card base created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardBaseResponseDTO'
 *       400:
 *         description: Invalid data provided
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Associated game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   get:
 *     tags:
 *       - CardBases
 *     summary: Get all card bases
 *     description: Retrieve a list of all available card bases
 *     responses:
 *       200:
 *         description: List of all card bases
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CardBaseResponseDTO'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /card-bases/game/{gameId}:
 *   get:
 *     tags:
 *       - CardBases
 *     summary: Get card bases by game ID
 *     description: Retrieve all card bases associated with a specific game
 *     parameters:
 *       - in: path
 *         name: gameId
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *     responses:
 *       200:
 *         description: List of card bases for the specified game
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CardBaseResponseDTO'
 *       404:
 *         description: Game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /card-bases/{id}:
 *   get:
 *     tags:
 *       - CardBases
 *     summary: Get a card base by ID
 *     description: Retrieve a specific card base by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card base ID
 *     responses:
 *       200:
 *         description: Card base information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardBaseResponseDTO'
 *       404:
 *         description: Card base not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   put:
 *     tags:
 *       - CardBases
 *     summary: Update a card base
 *     description: Update an existing card base by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card base ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateCardBaseDTO'
 *     responses:
 *       200:
 *         description: Card base updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardBaseResponseDTO'
 *       404:
 *         description: Card base or game not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   delete:
 *     tags:
 *       - CardBases
 *     summary: Delete a card base
 *     description: Delete a card base by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The card base ID
 *     responses:
 *       204:
 *         description: Card base deleted successfully
 *       404:
 *         description: Card base not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export {}; 