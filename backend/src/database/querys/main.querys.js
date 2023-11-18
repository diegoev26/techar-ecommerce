export const mainQuerys = {
  getMissingCae:
    "select VTRMVH_MODFOR modfor,VTRMVH_CODFOR codfor,VTRMVH_NROFOR nrofor from VTRMVH inner join (select * from dbo.USR_FN_ComprobantesQueValidanCAE()) comp on VTRMVH_MODFOR = comp.modfor and VTRMVH_CODFOR = comp.codfor where VTRMVH_NROCAE is null --and isnull(USR_VTRMVH_SENCAE,'N') <> 'S'",
  updateCae:
    "update VTRMVH set VTRMVH_NROCAE = @nrocae, VTRMVH_VENCAE = CONVERT(datetime,@vtocae) where VTRMVH_MODFOR = @modfor and VTRMVH_CODFOR = @codfor and VTRMVH_NROFOR = @nrofor",
  uploadExchange: "USR_SP_GRTVAL_IngresoDivisa",
  getExchangeToSend:
    "select GRTVAL_CODCOF,convert(varchar,GRTVAL_FECCAL,112) GRTVAL_FECCAL,GRTVAL_VALCOM,GRTVAL_VALORI from GRTVAL WHERE GRTVAL_CODCOF in ('EUR','USD') AND CONVERT(VARCHAR,GRTVAL_FECCAL,112) in (CONVERT(varchar,dateadd(day,datediff(day,1,GETDATE()),0),112),CONVERT(varchar,dateadd(day,datediff(day,0,GETDATE()),0),112))",
  getMsgToSend: "select * from messageHeader where msgSended = 0",
  getMsgBody: "select * from messageBody where idmsg = @idmsg",
  getMsgAttachment: "select * from messageAttachment where idmsg = @idmsg",
  setMsgSended:
    "update messageHeader set msgSended = 1, msgSendedDate = GETDATE() where idmsg = @idmsg",
  setMessage: "SP_IN_SetMessage",
  getParams: "select * from parameters where idInterface = @idInterface",
  BiSalesReport:
    "SELECT RMOV.*, MCLIENTE_D_DESCRP NombreCliente, MCLIENTE_C_CODVEN VendedorPorMaestro FROM [HARBUEAPP1002].HAR_QV.DBO.RMOV INNER JOIN [HARBUEAPP1002].HAR_QV.DBO.MCLIENTE ON MCLIENTE_C_CLIENTE=RMOV_C_CLIENTE WHERE (YEAR(RMOV_F_FCHMOV)*100)+MONTH(RMOV_F_FCHMOV)=@PERIOD AND CONVERT(VARCHAR,RMOV_F_FCHMOV,112)<=@hoy",
};
