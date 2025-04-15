/**
 * @swagger
 * components:
 *   schemas:
 *     CreateOfferDTO:
 *       type: object
 *       required:
 *         - publicationId
 *       properties:
 *         publicationId:
 *           type: string
 *           description: The ID of the publication to which the offer is being made
 *           example: "pub-abc123"
 *         moneyOffer:
 *           type: number
 *           description: Amount of money being offered
 *           example: 100
 *         cardExchangeIds:
 *           type: array
 *           items:
 *             type: string
 *           description: List of card IDs being offered in exchange
 *           example: ["card-1", "card-2"]

 *     OfferUpdatedDTO:
 *       type: object
 *       required:
 *         - statusOffer
 *         - publicationId
 *       properties:
 *         statusOffer:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED]
 *           description: New status of the offer
 *           example: "ACCEPTED"
 *         publicationId:
 *           type: string
 *           description: The ID of the related publication
 *           example: "pub-abc123"

 *     OfferResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The offer ID
 *           example: "offer-123"
 *         offerOwner:
 *           type: object
 *           properties:
 *             ownerId:
 *               type: string
 *               example: "user-xyz456"
 *             ownerName:
 *               type: string
 *               example: "John Doe"
 *         cardOffers:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "card-1"
 *               name:
 *                 type: string
 *                 example: "Blue Eyes White Dragon"
 *         statusOffer:
 *           type: string
 *           example: "PENDING"
 *         moneyOffer:
 *           type: number
 *           example: 100
 *         closedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-04-01T12:00:00Z"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2023-03-01T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2023-03-02T12:00:00Z"
 */

/**
 * @swagger
 * tags:
 *   name: Offers
 *   description: API for managing trade offers
 */

/**
 * @swagger
 * /offers:
 *   post:
 *     tags:
 *       - Offers
 *     summary: Create a new offer
 *     description: Allows a user to create a new offer for a publication, using cards, money or both
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
 *         description: Invalid offer data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Unexpected server error

 *   get:
 *     tags:
 *       - Offers
 *     summary: Get all offers (not implemented)
 *     responses:
 *       501:
 *         description: Not implemented
 */

/**
 * @swagger
 * /offers/{id}:
 *   get:
 *     tags:
 *       - Offers
 *     summary: Get an offer by ID (not implemented)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the offer
 *     responses:
 *       501:
 *         description: Not implemented

 *   put:
 *     tags:
 *       - Offers
 *     summary: Update an offer
 *     description: Update the status of an offer (accept or reject) and apply business logic accordingly
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The offer ID
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
 *         description: Invalid input or business rule violation
 *       401:
 *         description: Unauthorized action
 *       500:
 *         description: Unexpected server error
 */