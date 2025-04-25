/**
 * @swagger
 * components:
 *   schemas:
 *     CreateCardDTO:
 *       type: object
 *       required:
 *         - cardBaseId
 *         - statusCard
 *         - ownerId
 *       properties:
 *         cardBaseId:
 *           type: string
 *           example: "test-card-base-id"
 *         statusCard:
 *           type: number
 *           example: 1
 *         urlImage:
 *           type: string
 *           example: "http://example.com/image.png"
 *         ownerId:
 *           type: string
 *           example: "test-user-id"

 *     CardUpdatedDTO:
 *       type: object
 *       required:
 *         - ownerId
 *       properties:
 *         ownerId:
 *           type: string
 *           example: "test-user-id"
 *         urlImage:
 *           type: string
 *           example: "http://example.com/updated-image.png"
 *         statusCard:
 *           type: number
 *           example: 2

 *     CardResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "test-id"
 *         urlImage:
 *           type: string
 *           example: "http://example.com/image.png"
 *         cardBase:
 *           type: object
 *           properties:
 *             Id:
 *               type: string
 *               example: "test-card-base-id"
 *             Name:
 *               type: string
 *               example: "Test Card Base"
 *         game:
 *           type: object
 *           properties:
 *             Id:
 *               type: string
 *               example: "test-game-id"
 *             Name:
 *               type: string
 *               example: "Test Game"
 *         owner:
 *           type: object
 *           properties:
 *             ownerId:
 *               type: string
 *               example: "test-user-id"
 *             ownerName:
 *               type: string
 *               example: "Test User"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"

 *   parameters:
 *     CardId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: ID of the card

 * /cards:
 *   post:
 *     tags:
 *       - Cards
 *     summary: Create a new card
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCardDTO'
 *     responses:
 *       201:
 *         description: Card created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponseDTO'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected error

 *   get:
 *     tags:
 *       - Cards
 *     summary: Get all cards with filters
 *     parameters:
 *       - name: ownerId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: ID of the card owner
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CardResponseDTO'
 *       400:
 *         description: Error in filters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected server error

 * /cards/{id}:
 *   get:
 *     tags:
 *       - Cards
 *     summary: Get a card by ID
 *     parameters:
 *       - $ref: '#/components/parameters/CardId'
 *     responses:
 *       200:
 *         description: Card found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponseDTO'
 *       404:
 *         description: Card not found
 *       500:
 *         description: Unexpected error

 *   put:
 *     tags:
 *       - Cards
 *     summary: Update an existing card
 *     parameters:
 *       - $ref: '#/components/parameters/CardId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CardUpdatedDTO'
 *     responses:
 *       200:
 *         description: Card updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CardResponseDTO'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Card not found
 *       500:
 *         description: Unexpected error

 *   delete:
 *     tags:
 *       - Cards
 *     summary: Delete a card by ID
 *     parameters:
 *       - $ref: '#/components/parameters/CardId'
 *     responses:
 *       204:
 *         description: Card deleted successfully
 *       404:
 *         description: Card not found
 *       500:
 *         description: Unexpected error
 */
