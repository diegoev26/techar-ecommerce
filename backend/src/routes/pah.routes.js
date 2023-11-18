import { Router } from "express";
import {
  retrieveOrdersFromClound,
  updateOnCloud,
} from "../controllers/pah.controllers";
import config from "../config/config";

const router = Router();
const { update, retrieve } = config.routes.pah;

router.post(update, updateOnCloud);
router.post(retrieve, retrieveOrdersFromClound);

export default router;

/**
 * @swagger
 * components:
 *  schemas:
 *    200:
 *      type: object
 *      properties:
 *        code:
 *          type: integer
 *          description: Numero de código de respuesta
 *        response:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              description: Mensaje de respuesta
 *            data:
 *              oneOf:
 *                - type: object
 *                - type: array
 *              description: Json o Array con los datos de la respuesta
 *            reference:
 *              oneOf:
 *                - type: object
 *                - type: array
 *                - type: integer
 *                - type: string
 *              description: Dato referencial a la consulta
 *    201:
 *      type: object
 *      properties:
 *        code:
 *          type: integer
 *          description: Código de respuesta
 *        response:
 *          type: object
 *          properties:
 *            data:
 *              oneOf:
 *                - type: array
 *                - type: object
 *              description: Datos que comprueban la respuesta vacía
 *            message:
 *              type: string
 *              description: Mensaje de respuesta
 *    207:
 *      type: object
 *      properties:
 *        code:
 *          type: integer
 *          description: Numero de código de respuesta
 *        response:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              description: Mensaje de respuesta
 *            data:
 *              oneOf:
 *                - type: object
 *                - type: array
 *              description: Json o Array con los datos de la respuesta
 *            reference:
 *              oneOf:
 *                - type: object
 *                - type: array
 *                - type: integer
 *                - type: string
 *              description: Dato referencial a la consulta
 *        error:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              description: Mensaje de error
 *            data:
 *              oneOf:
 *                - type: object
 *                - type: array
 *              description: Json o Array con los datos del error
 *            reference:
 *              oneOf:
 *                - type: object
 *                - type: array
 *                - type: integer
 *                - type: string
 *              description: Dato referencial al error
 *    400:
 *      type: object
 *      properties:
 *        code:
 *           type: integer
 *           description: Numero de código de respuesta
 *        error:
 *          type: object
 *          properties:
 *            message:
 *              type: string
 *              description: Mensaje de error
 *            data:
 *              oneOf:
 *                - type: object
 *                - type: array
 *              description: Json o Array con los datos del error
 *            reference:
 *              oneOf:
 *                - type: object
 *                - type: array
 *                - type: integer
 *                - type: string
 *              description: Dato referencial al error
 *
 */

/**
 * @swagger
 * tags:
 *  name: PAH
 *  description: Endpoints para conectar con Portal de Autogestión Hafele
 */

/**
 * @swagger
 * /pah/updateOnCloud:
 *  post:
 *    summary: Actualiza el portal
 *    tags: [PAH]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              data:
 *                type: array
 *                description: Array con las tablas a actualizar
 *    responses:
 *      200:
 *        description: Actualización OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      201:
 *        description: No hay datos para actualizar
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/201'
 *      207:
 *        description: Actualizacón parcial
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/207'
 *      400:
 *        description: Error al actualizar
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 * /pah/retriveOrders:
 *  post:
 *    summary: Baja los pedidos desde el portal
 *    tags: [PAH]
 *    responses:
 *      200:
 *        description: Los pedidos bajaron OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      201:
 *        description: No hay pedidos para bajar
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/201'
 *      207:
 *        description: La bajada de los pedidos se realizó de manera parcial
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/207'
 *      400:
 *        description: Error al bajar pedidos
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 *      403:
 *        description: Error al bajar pedidos
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 */
