import { Router } from "express";
import {
  getDeliveryNotes,
  deliveryNoteToZebra,
  deliveryNotePrintAgain,
  updateDeliveryNotesPrinted,
  printReprocessLabel,
} from "../controllers/silhar.controllers";
import config from "../config/config";

const router = Router();
const {
  deliveryNotes,
  printDeliveryNote,
  updatePrinted,
  printAgain,
  reprocess,
} = config.routes.silhar;

router.post(deliveryNotes, getDeliveryNotes);
router.post(printDeliveryNote, deliveryNoteToZebra);
router.post(updatePrinted, updateDeliveryNotesPrinted);
router.post(printAgain, deliveryNotePrintAgain);
router.post(reprocess, printReprocessLabel); //Falta Documentar

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
 *  name: SILHAR
 *  description: Endpoints para herramientas del logística
 */

/**
 * @swagger
 * /silhar/getDeliveryNotes:
 *  post:
 *    summary: Obtiene los que tienen etiquetas pendientes de imprimir
 *    tags: [SILHAR]
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
 * /silhar/deliveryNoteToZebra:
 *  post:
 *    summary: Obtiene la/s etiqueta/s del remito y lo imprime en etiquetadora Zebra
 *    tags: [SILHAR]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              modfor:
 *                type: string
 *                description: Módulo del remito
 *              codfor:
 *                type: string
 *                description: Código del remito
 *              nrofor:
 *                type: integer
 *                description: Número del remito
 *              idPrinter:
 *                type: integer
 *                description: Id de la impresora desde la que se va a imprimir
 *              idLabel:
 *                type: integer
 *                description: Id del formato de etiqueta
 *              labels:
 *                oneOf:
 *                  - type: integer
 *                  - type: array
 *                description: Etiquetas del remito a imprimir. 0 para todas, especificar una o mandar en formato de array las necesarias
 *    responses:
 *      200:
 *        description: Etiqueta/s impresa/s OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      201:
 *        description: No hay datos para imprimir
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/201'
 *      207:
 *        description: Impresión parcial
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/207'
 *      400:
 *        description: Error al imprimir
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 *      401:
 *        description: Error al obtener datos para imprimir
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 * /silhar/updateDeliveryNotesPrinted:
 *  post:
 *    summary: Marca los remitos como impresos
 *    tags: [SILHAR]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              data:
 *                type: array
 *                description: Información de los remitos a marcar
 *                properties:
 *                  modfor:
 *                    type: string
 *                    desciption: Módulo del remito
 *                  codfor:
 *                    type: string
 *                    desciption: Código del remito
 *                  nrofor:
 *                    type: integer
 *                    desciption: Número del remito
 *              all:
 *                type: boolean
 *                description: Verdadero si todos los items del remito deben ser marcados
 *              printerId:
 *                type: integer
 *                description: Id de la impresora desde la que se imprimió
 *              labelId:
 *                type: integer
 *                description: Id del formato de etiqueta
 *    responses:
 *      200:
 *        description: Remitos marcados OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      400:
 *        description: No se pudieron marcar los remitos
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 * /silhar/deliveryNotePrintAgain:
 *  post:
 *    summary: Marca el remito como pendiente de impresión
 *    tags: [SILHAR]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              modfor:
 *                type: string
 *                description: Módulo del remito
 *              codfor:
 *                type: string
 *                description: Código del remito
 *              nrofor:
 *                type: integer
 *                description: Número del remito
 *    responses:
 *      200:
 *        description: Remito marcado OK
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/200'
 *      201:
 *        description: Remito no encontrado
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/201'
 *      400:
 *        description: Error al marcar el remito
 *        content:
 *         application/json:
 *            schema:
 *               $ref: '#/components/schemas/400'
 */
