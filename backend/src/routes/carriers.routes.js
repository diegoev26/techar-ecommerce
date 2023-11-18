import { Router } from "express";
import {
  getDeliveryNotesToTransmit,
  carrierNewOrder,
  translogCheckStock,
  carrierTracking,
  carrierGetSla,
  updateDeliveryNotes,
} from "../controllers/carriers.controllers";
import config from "../config/config";

const router = Router();
const {
  deliveryNotes,
  newOrder,
  tracking,
  sla,
  updateDeliveryNote,
  translogStock,
} = config.routes.carriers;

router.post(deliveryNotes, getDeliveryNotesToTransmit);
router.post(newOrder, carrierNewOrder);
router.post(tracking, carrierTracking); //Falta Documentar
router.post(sla, carrierGetSla); //Falta Documentar
router.post(updateDeliveryNote, updateDeliveryNotes); //Falta Documentar
router.post(translogStock, translogCheckStock);

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
 *  name: Transportistas
 *  description: Endpoints para conectar con transportistas
 */

/**
 * @swagger
 * /carriers/getDeliveryNotesToTransmit:
 *  post:
 *    summary: Obtiene los remitos para transmitir por transportista
 *    tags: [Transportistas]
 *    responses:
 *      200:
 *        description: Listado de remitos OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      201:
 *        description: Listado de remitos vacío
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/201'
 *      400:
 *        description: Error al obtener el listado de remitos
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 * /carriers/neworder:
 *  post:
 *    summary: Envía el remito al transportista y crea la orden
 *    tags: [Transportistas]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              data:
 *                type: array
 *                description: Array con la información a transmitir
 *    responses:
 *      200:
 *        description: Orden generada OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      201:
 *        description: Error al transmitir, archivo de transmisión generado
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/201'
 *      207:
 *        description: Transmisión parcial
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/207'
 *      400:
 *        description: Error al transmitir, archivo de transmision no generado
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 * /carriers/translog/checkStock:
 *  post:
 *    summary: Obtiene el stock actual en translog
 *    tags: [Transportistas]
 *    responses:
 *      200:
 *        description: Stock recibido OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      400:
 *        description: Error al obtener el stock
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 */
