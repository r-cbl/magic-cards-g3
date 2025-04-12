/**
 * @swagger
 * components:
 *   schemas:
 *     CreateGameDTO:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the game
 *           example: "Magic: The Gathering"
 *
 *     UpdateGameDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the game
 *           example: "Magic: The Gathering - Updated"
 *
 *     GameResponseDTO:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated ID of the game
 *           example: "game-abc123"
 *         name:
 *           type: string
 *           description: The name of the game
 *           example: "Magic: The Gathering"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date when the game was created
 *           example: "2023-01-01T00:00:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date when the game was last updated
 *           example: "2023-01-01T00:00:00.000Z"
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *           example: "Game not found"
 */

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: Game management API
 */

/**
 * @swagger
 * /games:
 *   post:
 *     tags:
 *       - Games
 *     summary: Create a new game
 *     description: Create a new game with the provided name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateGameDTO'
 *     responses:
 *       201:
 *         description: Game created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResponseDTO'
 *       400:
 *         description: Invalid data provided
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
 *       - Games
 *     summary: Get all games
 *     description: Retrieve a list of all available games
 *     responses:
 *       200:
 *         description: List of all games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/GameResponseDTO'
 *       500:
 *         description: Unexpected error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /games/{id}:
 *   get:
 *     tags:
 *       - Games
 *     summary: Get a game by ID
 *     description: Retrieve a specific game by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *     responses:
 *       200:
 *         description: Game information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResponseDTO'
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
 *
 *   put:
 *     tags:
 *       - Games
 *     summary: Update a game
 *     description: Update an existing game by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateGameDTO'
 *     responses:
 *       200:
 *         description: Game updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GameResponseDTO'
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
 *
 *   delete:
 *     tags:
 *       - Games
 *     summary: Delete a game
 *     description: Delete a game by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The game ID
 *     responses:
 *       204:
 *         description: Game deleted successfully
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

export {}; 