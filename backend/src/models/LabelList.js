export default [
  {
    labelId: 1,
    description: "Etiqueta Login",
    zplCode: `^XA
^CI28
^FX Area de Encabezado
^CF0,60
^FO100,40^FDHAFELE ARGENTINA S.A.^FS
^FO15,15^FR^GB775,100,100^FS
^CF0,30
^FO150,125^FDRuta Panamericana 28047 - B1611GFG^FS
^FO125,165^FDDon Torcuato - Buenos Aires - Argentina^FS
^FO115,205^FDTE: +54 11 2206 9200 - info@hafele.com.ar^FS
^FX Area de Cliente
^FO50,235^GB700,3,3^FS
^CF0,45
^FO50,250^FDCliente:^FS
^FO200,250^FD@codigoCliente^FS
^FO50,300^FD@nombreCliente^FS
^CF0,35
^FO50,350^FD@direccionL1^FS
^FO50,390^FD@direccionL2^FS
^FO50,430^FD@direccionL3^FS
^FX Guia
^FO50,470^GB700,3,3^FS
^CF0,65
^FO245,495^FD@numeroGuia^FS
^FO15,485^FR^GB775,70,70^FS
^FX Operador
^CF0,35
^FO240,565^FDOPERADOR LOGISTICO^FS
^CF0,65
^FO30,606^FD@operador^FS
^FO15,597^FR^GB775,70,70^FS
^FX Transportista
^CF0,35
^FO270,675^FDTRANSPORTISTA^FS
^CF0,65
^FO30,717^FD@transportista^FS
^FO15,707^FR^GB775,70,70^FS
^FX Datos Remito
^CF0,60
^FO50,790^FDRemito:^FS
^FO250,790^FD@numeroRemito^FS
^FO50,850^FDFecha:^FS
^FO245,850^FD@fechaRemito^FS
^FX Bultos
^CF0,60
^FO90,925^FDBULTOS:^FS
^CF0,100
^FO360,916^FD@numeroBulto/@cantidadBultos^FS
^FO315,906^FR^GB315,100,100^FS
^FX Código de Barras
^FO50,1015^GB700,3,3^FS
^BY3,3,130
^FO100,1025^BC^FD@codigoBarras^FS
^XZ`,
  },
];
