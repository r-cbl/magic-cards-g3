/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePublicationDTO:
 *       type: object
 *       required:
 *         - cardId
 *       properties:
 *         cardId:
 *           type: string
 *           example: "card-123"
 *         cardExchangeIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["card-789", "card-321"]
 *         valueMoney:
 *           type: number
 *           example: 150

 *     PublicationUpdatedDTO:
 *       type: object
 *       required:
 *         - cardExchangeIds
 *       properties:
 *         valueMoney:
 *           type: number
 *           example: 200
 *         cardExchangeIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["card-111", "card-222"]

 *     PublicationResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         valueMoney:
 *           type: number
 *         cardExchangeIds:
 *           type: array
 *           items:
 *             type: string
 *         cardBase:
 *           type: object
 *           properties:
 *             Id:
 *               type: string
 *             Name:
 *               type: string
 *         game:
 *           type: object
 *           properties:
 *             Id:
 *               type: string
 *             Name:
 *               type: string
 *         owner:
 *           type: object
 *           properties:
 *             ownerId:
 *               type: string
 *             ownerName:
 *               type: string
 *         offers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               offerId:
 *                 type: string
 *               moneyOffer:
 *                 type: number
 *               cardExchangeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *         createdAt:
 *           type: string
 *           format: date-time

 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/CardResponseDTO'
 *         total:
 *           type: number
 *           example: 100
 *         limit:
 *            type: number
 *            example: 10
 *         offset:
 *            type: number
 *            example: 10
 *         hasMore:
 *            type: boolean
 *            example: true

 *   parameters:
 *     PublicationId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: Publication ID

 *     GamesIdsQuery:
 *       in: query
 *       name: gamesIds
 *       schema:
 *         type: string
 *       description: Comma-separated game IDs (game1,game2,...)

 *     CardBaseIdsQuery:
 *       in: query
 *       name: cardBaseIds
 *       schema:
 *         type: string
 *       description: Comma-separated card base IDs (cb1,cb2,...)

 *     OwnerIdQuery:
 *       in: query
 *       name: ownerId
 *       schema:
 *         type: string
 *       description: Publication owner ID

 *     InitialDateQuery:
 *       in: query
 *       name: initialDate
 *       schema:
 *         type: string
 *         format: date-time
 *       description: Minimum creation date (ISO 8601)

 *     EndDateQuery:
 *       in: query
 *       name: endDate
 *       schema:
 *         type: string
 *         format: date-time
 *       description: Maximum creation date (ISO 8601)

 *     MinValueQuery:
 *       in: query
 *       name: minValue
 *       schema:
 *         type: number
 *       description: Minimum monetary value

 *     MaxValueQuery:
 *       in: query
 *       name: maxValue
 *       schema:
 *         type: number
 *       description: Maximum monetary value

 *     PageQuery:
 *       in: query
 *       name: page
 *       schema:
 *         type: number
 *         default: 1
 *       description: Page number for pagination

 *     LimitQuery:
 *       in: query
 *       name: limit
 *       schema:
 *         type: number
 *         default: 10
 *       description: Number of items per page
 */

/**
 * @swagger
 * /publications:
 *   post:
 *     tags:
 *       - Publications
 *     summary: Create a new publication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePublicationDTO'
 *     responses:
 *       201:
 *         description: Publication created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicationResponseDTO'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected server error

 *   get:
 *     tags:
 *       - Publications
 *     summary: Get publications with filters and pagination
 *     parameters:
 *       - $ref: '#/components/parameters/GamesIdsQuery'
 *       - $ref: '#/components/parameters/CardBaseIdsQuery'
 *       - $ref: '#/components/parameters/OwnerIdQuery'
 *       - $ref: '#/components/parameters/InitialDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - $ref: '#/components/parameters/MinValueQuery'
 *       - $ref: '#/components/parameters/MaxValueQuery'
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *     responses:
 *       200:
 *         description: Paginated list of publications
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Invalid filters or pagination parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected server error

 * /publications/{id}:
 *   get:
 *     tags:
 *       - Publications
 *     summary: Get a publication by ID
 *     parameters:
 *       - $ref: '#/components/parameters/PublicationId'
 *     responses:
 *       200:
 *         description: Publication found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicationResponseDTO'
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Unexpected error

 *   put:
 *     tags:
 *       - Publications
 *     summary: Update an existing publication
 *     parameters:
 *       - $ref: '#/components/parameters/PublicationId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PublicationUpdatedDTO'
 *     responses:
 *       200:
 *         description: Publication updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicationResponseDTO'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Unexpected server error

 *   delete:
 *     tags:
 *       - Publications
 *     summary: Delete a publication by ID
 *     parameters:
 *       - $ref: '#/components/parameters/PublicationId'
 *     responses:
 *       204:
 *         description: Publication deleted successfully
 *       404:
 *         description: Publication not found
 *       500:
 *         description: Unexpected error
 */