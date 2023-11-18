import { Router } from "express";
import {
  actualStep,
  addComment,
  addContactData,
  deleteContactData,
  deleteSwitchOrder,
  getComments,
  getConfirmData,
  getContactData,
  getData,
  getDataToChart,
  getPercepts,
  getStatus,
  payPercepts,
  saleConfirm,
  setPercepts,
  taxConfirm,
} from "../controllers/ecomm.controllers";
import config from "../config/config";

const router = Router();
const {
  data,
  chartData,
  status,
  tax,
  perceptsGet,
  perceptsSet,
  perceptsPay,
  confirmData,
  confirm,
  step,
  contactData,
  contactDataAdd,
  contactDataDelete,
  deleteSwitch,
  commentAdd,
  commentGet,
} = config.routes.ecommerce;

router.post(data, getData);
router.post(chartData, getDataToChart);
router.post(status, getStatus);
router.post(tax, taxConfirm);
router.post(perceptsGet, getPercepts);
router.post(perceptsSet, setPercepts);
router.post(perceptsPay, payPercepts);
router.post(confirmData, getConfirmData);
router.post(confirm, saleConfirm);
router.post(step, actualStep);
router.post(contactData, getContactData);
router.post(contactDataAdd, addContactData);
router.post(contactDataDelete, deleteContactData);
router.post(deleteSwitch, deleteSwitchOrder);
router.post(commentAdd, addComment);
router.post(commentGet, getComments);

export default router;
