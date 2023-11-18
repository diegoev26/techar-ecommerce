const {
  REACT_APP_SERVER,
  REACT_APP_PORT,
  REACT_APP_API_MAIN_MASSIVEMAILING,
  REACT_APP_API_SILHAR_URL,
  REACT_APP_API_SILHAR_DELIVERYNOTES,
  REACT_APP_API_SILHAR_DELIVERYNOTETOZEBRA,
  REACT_APP_API_SILHAR_UPDATEDELIVERYNOTESPRINTED,
  REACT_APP_API_SILHAR_PRINTAGAIN,
  REACT_APP_API_SILHAR_PRINTREPROCESSLABEL,
  REACT_APP_API_CARRIERS_URL,
  REACT_APP_API_CARRIERS_TRANSLOG_URL,
  REACT_APP_API_CARRIERS_LOGIN_URL,
  REACT_APP_API_CARRIERS_DELIVERYNOTES,
  REACT_APP_API_CARRIERS_NEWORDER,
  REACT_APP_API_CARRIERS_TRACKING,
  REACT_APP_API_CARRIERS_UPDATEDELIVERYNOTES,
  REACT_APP_API_ECOMMERCE_URL,
  REACT_APP_API_ECOMMERCE_DATA,
  REACT_APP_API_ECOMMERCE_DATATOCHART,
  REACT_APP_API_ECOMMERCE_STATUS,
  REACT_APP_API_ECOMMERCE_TAXCONFIRM,
  REACT_APP_API_ECOMMERCE_GETPERCEPTS,
  REACT_APP_API_ECOMMERCE_SETPERCEPTS,
  REACT_APP_API_ECOMMERCE_PAYPERCEPTS,
  REACT_APP_API_ECOMMERCE_CONFIRMDATA,
  REACT_APP_API_ECOMMERCE_SALECONFIRM,
  REACT_APP_API_ECOMMERCE_ACTUALSTEP,
  REACT_APP_API_ECOMMERCE_GETCONTACTDATA,
  REACT_APP_API_ECOMMERCE_ADDCONTACTDATA,
  REACT_APP_API_ECOMMERCE_DETELECONTACTDATA,
  REACT_APP_API_ECOMMERCE_DELETESWITCHORDER,
  REACT_APP_API_ECOMMERCE_ADDCOMMENT,
  REACT_APP_API_ECOMMERCE_GETCOMMENTS,
} = process.env;

export default {
  server: REACT_APP_SERVER,
  port: REACT_APP_PORT,
  main: {
    massiveMailing: REACT_APP_API_MAIN_MASSIVEMAILING,
  },
  silhar: {
    url: REACT_APP_API_SILHAR_URL,
    getDeliveryNotes: REACT_APP_API_SILHAR_DELIVERYNOTES,
    deliveryNoteToZebra: REACT_APP_API_SILHAR_DELIVERYNOTETOZEBRA,
    updateDeliveryNotesPrinted: REACT_APP_API_SILHAR_UPDATEDELIVERYNOTESPRINTED,
    deliveryNotePrintAgain: REACT_APP_API_SILHAR_PRINTAGAIN,
    printReprocessLabel: REACT_APP_API_SILHAR_PRINTREPROCESSLABEL,
  },
  carriers: {
    url: REACT_APP_API_CARRIERS_URL,
    getDeliveryNotesToTransmit: REACT_APP_API_CARRIERS_DELIVERYNOTES,
    newOrder: REACT_APP_API_CARRIERS_NEWORDER,
    tracking: REACT_APP_API_CARRIERS_TRACKING,
    updateDeliveryNotes: REACT_APP_API_CARRIERS_UPDATEDELIVERYNOTES,
    translog: {
      url: REACT_APP_API_CARRIERS_TRANSLOG_URL,
    },
    login: {
      url: REACT_APP_API_CARRIERS_LOGIN_URL,
    },
  },
  ecommerce: {
    url: REACT_APP_API_ECOMMERCE_URL,
    getData: REACT_APP_API_ECOMMERCE_DATA,
    getDataToChart: REACT_APP_API_ECOMMERCE_DATATOCHART,
    getStatus: REACT_APP_API_ECOMMERCE_STATUS,
    taxConfirm: REACT_APP_API_ECOMMERCE_TAXCONFIRM,
    getPercepts: REACT_APP_API_ECOMMERCE_GETPERCEPTS,
    setPercepts: REACT_APP_API_ECOMMERCE_SETPERCEPTS,
    payPercepts: REACT_APP_API_ECOMMERCE_PAYPERCEPTS,
    getConfirmData: REACT_APP_API_ECOMMERCE_CONFIRMDATA,
    saleConfirm: REACT_APP_API_ECOMMERCE_SALECONFIRM,
    actualStep: REACT_APP_API_ECOMMERCE_ACTUALSTEP,
    getContactData: REACT_APP_API_ECOMMERCE_GETCONTACTDATA,
    addContactData: REACT_APP_API_ECOMMERCE_ADDCONTACTDATA,
    deleteContactData: REACT_APP_API_ECOMMERCE_DETELECONTACTDATA,
    deleteSwitchOrder: REACT_APP_API_ECOMMERCE_DELETESWITCHORDER,
    addComment: REACT_APP_API_ECOMMERCE_ADDCOMMENT,
    getComments: REACT_APP_API_ECOMMERCE_GETCOMMENTS,
  },
};
