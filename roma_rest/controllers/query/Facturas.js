exports.generarFacturaReturnId = `
    SELECT roma.facturar_venta($1, $2) as facturas_id;
`;
exports.facturaRechazada = `
    SELECT roma.factura_rechazada($1, $2) as facturas_id;
`;

exports.getDatosFactura = `
    SELECT *
    FROM roma.facturas fac
    JOIN factura_electronica.facturas_input fi ON fac.id = fi.facturas_id
    WHERE fac.id = $1;
`;

exports.insertRespuestaAprobada = `
INSERT INTO factura_electronica.respuesta_afip(fecae_cabecera_punto_venta,
	fecae_cabecera_cantidad_items, fecae_cabecera_cuit, fecae_cabecera_fecha_proceso,
	fecae_cabecera_reproceso, fecae_cabecera_tipo_comprobante, fecae_cabecera_resultado,
	fecae_detalle_comprobante_desde, fecae_detalle_comprobante_fecha, fecae_detalle_comprobante_hasta,
	fecae_detalle_concepto, fecae_detalle_documento_tipo, fecae_detalle_documento_numero,
    fecae_detalle_resultado,facturas_input_id,fecha_mov, 
    fecae_detalle_cae, fecae_detalle_fecha_vencimiento)
SELECT $3, $6, $2
, $5 as fecae_cabecera_fecha_proceso
, $8, $4, $7 as resultado
, $12, $14, $13
, $9, $10, $11, $15 as fecae_detalle_resultado
, id as facturas_input_id
, now() as fecha_mov
, $16, $17
FROM factura_electronica.facturas_input 
WHERE facturas_id = $1
RETURNING id as respuesta_afip_id;
`;

exports.setCaeFchVto = `
    SELECT factura_electronica.set_cae_vencimiento($1) as respuesta;
`;