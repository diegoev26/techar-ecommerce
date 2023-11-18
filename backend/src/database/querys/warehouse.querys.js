export const warehouseQuerys = {
  deliveryNotesToPrint: `select  * from USR_VW_IN_DeliveryNotesToPrint where fechaComprobante >= @dateInit`,
  getPrinterList: "select * from printerMaster",
  insertDeliveryNotes: "SP_deliveryNotesInsert",
  deliveryNotesHeadersToPrint:
    "select  * from USR_VW_IN_DeliveryNotesToPrint where modfor = @modfor and codfor = @codfor and nrofor = @nrofor",
  deliveryNotesItemsByForm: `select * from deliveryNotesItems where modfor = @modfor and codfor = @codfor and nrofor = @nrofor`,
  insertPrinterTransaction: "SP_printerTransactionsInsert",
  insertPrinterTransactionAll: "SP_printerTransactionsAll",
  silharPrintAgain: "SP_deliveryNotesPrintAgain",
  devlieryNotesToTransmit: `select * from deliveryNotesHeaders where canceled = 0 and printed = 1 and transmitted = 0 and idInterface = @idCarrier`,
  deliveryNotesHeadersToTransmit:
    "select * from USR_VW_IN_DeliveryNotesCarriers where modfor = @modfor and codfor = @codfor and nrofor = @nrofor and idTransportista = @idTransportista",
  deliveryNotesTransmitted: "SP_deliveryNoteTransmitted",
  getDeliveryNotesNotDelivered:
    "select top 75 HR.USR_HRRMVI_MODOST modfor, HR.USR_HRRMVI_CODOST codfor, HR.USR_HRRMVI_NROOST nrofor, DN.idInterface from USR_HRRMVI HR inner join [Interfaces].[dbo].[deliveryNotesHeaders] DN on HR.USR_HRRMVI_MODOST = DN.modfor and HR.USR_HRRMVI_CODOST = DN.codfor and HR.USR_HRRMVI_NROOST = DN.nrofor where HR.USR_HR_DEBAJA = 'N' and HR.USR_HRRMVI_ESTADO = 'I'",
  setDeliveryNoteDelivered:
    "UPDATE USR_HRRMVI SET USR_HRRMVI_REMENT = 'S', USR_HRRMVI_FECENT = CONVERT(DATETIME,@strDate,112), USR_HRRMVI_ESTADO = 'E' WHERE USR_HRRMVI_MODOST = @modfor AND USR_HRRMVI_CODOST = @codfor AND USR_HRRMVI_NROOST = @nrofor AND USR_HRRMVI_ESTADO = 'I'",
  getSLAData:
    "select HR.USR_HRRMVI_HRRMVH_MODFOR modforHR, HR.USR_HRRMVI_HRRMVH_CODFOR codforHR, HR.USR_HRRMVI_HRRMVH_NROFOR nroforHR, HR.USR_HRRMVI_HRRMVH_NROITM nroitmHR, DN.modfor modforRX, DN.codfor codforRX, DN.nrofor nroforRX, DN.clientCode nroCliente, DN.clientName nombreCliente, CONVERT(varchar,HR.usr_hr_fecalt,112) fechaSalida, ISNULL(HR.USR_HRRMVI_REMENT, 'N') remitoEntregado, CASE WHEN ISNULL(HR.USR_HRRMVI_REMENT,'N') = 'N' THEN 'Pendiente' ELSE CONVERT(VARCHAR,HR.USR_HRRMVI_FECENT,112) END FechaEntregado, ISNULL(USR_HRRMVI_REMREN,'N') remitoRendido, CASE WHEN ISNULL(HR.USR_HRRMVI_REMREN,'N') = 'N' THEN 'Pendiente' ELSE CONVERT(VARCHAR,HR.USR_HRRMVI_FECREN,112) END FechaRendido, ISNULL(CONVERT(int, HR.USR_HRRMVI_BULOST),0) bultos, HR.USR_HRRMVI_PESOST pesoKg, DN.totalAmount valorPesos, HR.USR_HRRMVI_ESTADO estado, DN.logisticOperator transportista from [Hafele].[dbo].[USR_HRRMVI] HR inner join [Interfaces].[dbo].[deliveryNotesHeaders] DN on HR.USR_HRRMVI_MODOST = DN.modfor and HR.USR_HRRMVI_CODOST = DN.codfor and HR.USR_HRRMVI_NROOST = DN.nrofor",
  cancelDeliveryNote:
    "update USR_HRRMVI set USR_HRRMVI_ESTADO = 'A' where usr_hrrmvi_modost = @modforRX and usr_hrrmvi_codost = @codforRX and usr_hrrmvi_nroost = @nroforRX  and USR_HRRMVI_HRRMVH_MODFOR = @modforHR and USR_HRRMVI_HRRMVH_CODFOR = @codforHR and USR_HRRMVI_HRRMVH_NROFOR = @nroforHR and USR_HRRMVI_ESTADO = 'I'",
  renderDeliveryNote: "USR_SP_HRRMVI_RendirRemito",
  transferDeliveryNote: "USR_SP_HRRMVI_TransferirRemitoHR",
  getReprocessZpl:
    "select dbo.USR_FN_ETIQUETAS_HARETI(@TIPPRO,@ARTCOD,@impEAN,@impQR,@impPACK) zpl",
};
