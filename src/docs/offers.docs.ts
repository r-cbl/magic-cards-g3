/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOfferDTO:
 *       type: object
 *       required:
 *         - publicationId
 *         - offerOwnerId
 *       properties:
 *         publicationId:
 *           type: string
 *           example: "valid-publication-id"
 *         offerOwnerId:
 *           type: string
 *           example: "test-user-id"
 *         moneyOffer:
 *           type: number
 *           example: 100
 *         cardExchangeIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["card-id-1", "card-id-2"]

 *     OfferResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "offer-id"
 *         publicationId:
 *           type: string
 *           example: "valid-publication-id"
 *         moneyOffer:
 *           type: number
 *           example: 100
 *         cardExchangeIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["card-id-1", "card-id-2"]
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-01-01T00:00:00Z"
 *         status:
 *           type: string
 *           example: "PENDING"

 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/OfferResponseDTO'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: number
 *               example: 100
 *             page:
 *               type: number
 *               example: 1
 *             limit:
 *               type: number
 *               example: 10
 *             totalPages:
 *               type: number
 *               example: 10

 *   parameters:
 *     OfferId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: ID of the offer

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
 
 * /offers:
 *   post:
 *     tags:
 *       - Offers
 *     summary: Create a new offer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOfferDTO'
 *     responses:
 *       201:
 *         description: Offer created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferResponseDTO'
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected error

 *   get:
 *     tags:
 *       - Offers
 *     summary: Get all offers with filters and pagination
 *     parameters:
 *       - name: ownerId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: ID of the offer owner
 *       - name: publicationId
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: ID of the publication
 *       - name: status
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         description: Status of the offer
 *       - $ref: '#/components/parameters/PageQuery'
 *       - $ref: '#/components/parameters/LimitQuery'
 *     responses:
 *       200:
 *         description: Paginated list of offers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       400:
 *         description: Error in filters or pagination parameters
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected server error

 * /offers/{id}:
 *   get:
 *     tags:
 *       - Offers
 *     summary: Get an offer by ID
 *     parameters:
 *       - $ref: '#/components/parameters/OfferId'
 *     responses:
 *       200:
 *         description: Offer found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferResponseDTO'
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Unexpected error
 *   put:
 *     tags:
 *       - Offers
 *     summary: Update an existing offer
 *     parameters:
 *       - $ref: '#/components/parameters/OfferId'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfferUpdatedDTO'
 *     responses:
 *       200:
 *         description: Offer updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfferResponseDTO'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Unexpected error
 *   delete:
 *     tags:
 *       - Offers
 *     summary: Delete an offer by ID
 *     parameters:
 *       - $ref: '#/components/parameters/OfferId'
 *     responses:
 *       204:
 *         description: Offer deleted successfully
 *       404:
 *         description: Offer not found
 *       500:
 *         description: Unexpected error
 */
