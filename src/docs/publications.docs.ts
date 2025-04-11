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

 *   parameters:
 *     PublicationId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *       description: ID de la publicación

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

 * /publications/{id}:
 *   get:
 *     tags:
 *       - Publications
 *     summary: Obtener una publicación por ID
 *     parameters:
 *       - $ref: '#/components/parameters/PublicationId'
 *     responses:
 *       200:
 *         description: Publicación encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicationResponseDTO'
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error inesperado
 *   put:
 *     tags:
 *       - Publications
 *     summary: Actualizar una publicación existente
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
 *         description: Publicación actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublicationResponseDTO'
 *       400:
 *         description: Error de validación
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error inesperado

 *   delete:
 *     tags:
 *       - Publications
 *     summary: Eliminar una publicación por ID
 *     parameters:
 *       - $ref: '#/components/parameters/PublicationId'
 *     responses:
 *       204:
 *         description: Publicación eliminada correctamente
 *       404:
 *         description: Publicación no encontrada
 *       500:
 *         description: Error inesperado
 */
