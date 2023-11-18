import { Router } from "express";
import {
  getParams,
  massiveMailing,
  sendPendingMessage,
  sendSql,
} from "../controllers/main.controllers";
import config from "../config/config";

const router = Router();
const { pendingMessage, params, sql, mailing } = config.routes.main;

router.post(pendingMessage, sendPendingMessage);
router.post(params, getParams);
router.post(sql, sendSql); //Falta documentar
router.post(mailing, massiveMailing); //Falta documentar

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
 *  name: Generales
 *  description: Endpoints generales Hafele
 */

/**
 * @swagger
 * /sendPendingMessage:
 *  post:
 *    summary: Chequea si hay mensajes pendiente de envío y los envía
 *    tags: [Generales]
 *    responses:
 *      200:
 *        description: Mensajes enviados OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      201:
 *        description: No hay mensajes para enviar
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/201'
 *      207:
 *        description: Mensajes enviados de manera parcial
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/207'
 *      400:
 *        description: Error al enviar mensajes
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 */
