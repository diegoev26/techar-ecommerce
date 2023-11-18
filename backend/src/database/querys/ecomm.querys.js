export const ecommQuerys = {
  getSalesToCharts:
    "SELECT ((YEAR(H.SAR_FCRMVH_FCHMOV)*100) + (MONTH(H.SAR_FCRMVH_FCHMOV))) Periodo, CAST(SUM(I.SAR_FCRMVI_PRECIO/1.21*SAR_FCRMVI_CANTID) AS decimal(24,2))  as ImporteVentasSinImpuestos FROM SAR_FCRMVI I, SAR_FCRMVH H, STMPDH M WHERE H.SAR_FC_DEBAJA='N' AND H.SAR_FCRMVH_IDENTI=I.SAR_FCRMVi_IDENTI AND I.SAR_FCRMVI_TIPPRO='RV' AND I.SAR_FCRMVI_TIPPRO=M.STMPDH_TIPPRO AND I.SAR_FCRMVI_ARTCOD=M.STMPDH_ARTCOD GROUP BY ((YEAR(H.SAR_FCRMVH_FCHMOV)*100) + (MONTH(H.SAR_FCRMVH_FCHMOV))); SELECT ((YEAR(H.SAR_FCRMVH_FCHMOV)*100) + (MONTH(H.SAR_FCRMVH_FCHMOV))) Periodo, COUNT(DISTINCT(H.SAR_FCRMVH_IDENTI)) CantidadVentas FROM SAR_FCRMVI I, SAR_FCRMVH H, STMPDH M WHERE H.SAR_FC_DEBAJA='N' AND H.SAR_FCRMVH_IDENTI=I.SAR_FCRMVi_IDENTI AND I.SAR_FCRMVI_TIPPRO='RV' AND I.SAR_FCRMVI_TIPPRO=M.STMPDH_TIPPRO AND I.SAR_FCRMVI_ARTCOD=M.STMPDH_ARTCOD GROUP BY ((YEAR(H.SAR_FCRMVH_FCHMOV)*100) + (MONTH(H.SAR_FCRMVH_FCHMOV)));",
  getData:
    "select [Estado], [Identi], [CodigoCliente], [TipoCliente], [NombreCliente], [FechaVenta], [CantidadProductos], [Importe], [ComprobanteERP], [ImporteTrasporte], [PasoActual] from USR_VW_ECommerceStatusSalesOrders order by Estado, FechaVenta, PasoActual, ComprobanteERP, Identi;",
  getStatus: "SELECT DBO.USR_FN_BalconyMonitoreoPedidos() [Monitoreo]; ",
  previousTax:
    "select ISNULL(SAR_FCRMVH_NROCTA,'') NROCTA from SAR_FCRMVH where SAR_FCRMVH_IDENTI = @identi; ",
  switchClientTax: "USR_SP_BalconySwitchCliente",
  insertRI: "USR_SP_Balcony_Insert_ResponsableInscripto",
  insertCF: "USR_SP_Balcony_ConsumidorFinalApruebaPedido",
  getPercepts:
    "SELECT DBO.USR_FN_BalconyCalculaPercepcion(@identi,3) [Percepciones];",
  setPercepts: "USR_SP_BalconyInsertPercepciones",
  payPercepts: "USR_SP_BalconyUpdatePercep",
  confirmSaleData:
    "select sar_fcrmvh_identi [Número Pedido], fcrmvh_nombre [Nombre Cliente], FCRMVH_NROCTA [Código Cliente], case when SAR_FCRMVH_NROCTA = 'AR9995' THEN 'Responsable Inscripto' when SAR_FCRMVH_NROCTA = 'AR9994' THEN 'Monotributista' when SAR_FCRMVH_NROCTA = 'AR9993' THEN 'Consumidor Final' when SAR_FCRMVH_NROCTA = 'AR9992' THEN 'Responsable Inscripto M' end [Cond. IVA Cliente], USR_VW_ECommerceStatusSalesOrders.ComprobanteERP [Comprobante Interno], '$ ' + CONVERT(VARCHAR, CONVERT(VARCHAR, CAST(USR_VW_ECommerceStatusSalesOrders.Importe  AS MONEY), 1)) [Importe],'$ ' + CONVERT(VARCHAR, CONVERT(VARCHAR, CAST(usr_fc_perbal_importe  AS MONEY), 1)) [Percepciones], fcrmvh_dirent [Dirección Entrega], usr_fc_perbal_codpag [Comprobante de pago n°] from fcrmvh left join sar_fcrmvh on sar_fcrmvh_nrodoc = fcrmvh_nrodoc left join USR_VW_ECommerceStatusSalesOrders on sar_fcrmvh_identi = USR_VW_ECommerceStatusSalesOrders.Identi left join USR_FC_PERBAL on USR_VW_ECommerceStatusSalesOrders.Identi = USR_FC_PERBAL_IDENTI where sar_fcrmvh_identi = @identi;",
  actualStep: "SELECT DBO.USR_FN_BalconyPasoActual (@identi) [PASOS];",
  saleConfirm:
    "UPDATE USR_FC_PEDBAL set USR_FC_PEDBAL_PASO06 = 'S' WHERE USR_FC_PEDBAL_IDENTI = @identi;",
  resetOrder: "USR_SP_BalconyResetIngresoPedidos",
  deleteOrder: "USR_SP_BalconyCancelarPedido",
  contactData:
    "select isnull(sar_fcrmvh_direml,'') mail, isnull(sar_fcrmvh_telefn,'') telefono from SAR_FCRMVH where SAR_FCRMVH_IDENTI = @identi;",
  resetOrder: "USR_SP_BalconyResetIngresoPedidos",
  // deleteOrder: "USR_SP_BalconyCancelarPedido",
  addComment: "USR_SP_BalconyInsertLog",
  getComments:
    "select convert(varchar,usr_fcrlml_fecint,103) [FECINT], usr_fcrlml_usrint [USRINT], usr_fcrlml_desint [DESINT] from usr_fcrlml where usr_fcrlml_identi = @identi;",
};
