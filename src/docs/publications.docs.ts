/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePublicationDTO:
 *       type: object
 *       required:
 *         - cardId
 *         - ownerId
 *       properties:
 *         cardId:
 *           type: string
 *           example: "card-123"
 *         ownerId:
 *           type: string
 *           example: "user-456"
 *         cardExchangeIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["card-789", "card-321"]
 *         valueMoney:
 *           type: number
 *           example: 150

 *     PublicationResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "pub-123"
 *         name:
 *           type: string
 *           example: "Pikachu EX"
 *         valueMoney:
 *           type: number
 *           example: 150
 *         cardExchangeIds:
 *           type: array
 *           items:
 *             type: string
 *           example: ["card-789", "card-321"]
 *         cardBase:
 *           type: object
 *           properties:
 *             Id:
 *               type: string
 *               example: "cb-001"
 *             Name:
 *               type: string
 *               example: "Pikachu"
 *         game:
 *           type: object
 *           properties:
 *             Id:
 *               type: string
 *               example: "game-001"
 *             Name:
 *               type: string
 *               example: "Pokémon"
 *         owner:
 *           type: object
 *           properties:
 *             ownerId:
 *               type: string
 *               example: "user-456"
 *             ownerName:
 *               type: string
 *               example: "Franco"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2025-04-10T15:00:00Z"

 *   parameters:
 *     GamesIdsQuery:
 *       in: query
 *       name: gamesIds
 *       schema:
 *         type: string
 *       description: IDs de juegos separados por coma (game1,game2,...)
 *     CardBaseIdsQuery:
 *       in: query
 *       name: cardBaseIds
 *       schema:
 *         type: string
 *       description: IDs de cartas base separados por coma (cb1,cb2,...)
 *     OwnerIdQuery:
 *       in: query
 *       name: ownerId
 *       schema:
 *         type: string
 *       description: ID del dueño de la publicación
 *     InitialDateQuery:
 *       in: query
 *       name: initialDate
 *       schema:
 *         type: string
 *         format: date-time
 *       description: Fecha mínima de creación (ISO 8601)
 *     EndDateQuery:
 *       in: query
 *       name: endDate
 *       schema:
 *         type: string
 *         format: date-time
 *       description: Fecha máxima de creación (ISO 8601)
 *     MinValueQuery:
 *       in: query
 *       name: minValue
 *       schema:
 *         type: number
 *       description: Valor mínimo en dinero
 *     MaxValueQuery:
 *       in: query
 *       name: maxValue
 *       schema:
 *         type: number
 *       description: Valor máximo en dinero
 */

/**
 * @swagger
 * /publications:
 *   post:
 *     tags:
 *       - Publications
 *     summary: Crear una publicación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePublicationDTO'
 *     responses:
 *       201:
 *         description: Publicación creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicationResponseDTO'
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error inesperado

 *   get:
 *     tags:
 *       - Publications
 *     summary: Obtener publicaciones con filtros
 *     parameters:
 *       - $ref: '#/components/parameters/GamesIdsQuery'
 *       - $ref: '#/components/parameters/CardBaseIdsQuery'
 *       - $ref: '#/components/parameters/OwnerIdQuery'
 *       - $ref: '#/components/parameters/InitialDateQuery'
 *       - $ref: '#/components/parameters/EndDateQuery'
 *       - $ref: '#/components/parameters/MinValueQuery'
 *       - $ref: '#/components/parameters/MaxValueQuery'
 *     responses:
 *       200:
 *         description: Lista de publicaciones filtradas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PublicationResponseDTO'
 *       400:
 *         description: Error en los filtros
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error inesperado del servidor
 */
