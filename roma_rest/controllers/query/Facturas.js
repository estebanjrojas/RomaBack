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

exports.getDatosFacturaImpresion = `
    SELECT facturas_id, clientes_id, ventas_id
         , to_char(fac.fecha_vencimiento, 'dd/mm/YYYY') as fecha_vencimiento
         , fac.cae, fac.fecha_vencimiento_cae
         , fac.monto_total, fac.monto_neto, fac.monto_iva
         , to_char(fac.fecha_emision::date, 'dd/mm/YYYY') as fecha_emision
         , fac.punto_venta_factura, fac.numero_factura
         , tcm.descripcion as tipo_factura
         , prs.nro_doc as documento_cliente, prs.tipo_doc as tipo_documento_cliente
         , prs.apellido as apellido_cliente, prs.nombre as nombre_cliente
         , prs.telefono as telefono_cliente, prs.telefono_cel as cel_cliente, prs.email as email_cliente
         , emp.razon_social, emp.nombre_fantasia, emp.telefono as telefono_empresa, emp.email as email_empresa
         , pfi.cuit as cuit_empresa
    FROM roma.facturas fac
    JOIN roma.tipos_comprobantes tcm ON fac.tipo_factura = tcm.id
    JOIN roma.ventas vta ON fac.ventas_id = vta.id
    JOIN roma.empresas emp ON vta.empresas_id = emp.id
    JOIN roma.parametros_fiscales pfi ON emp.id = pfi.empresas_id AND now()::date between pfi.fecha_desde and coalesce(pfi.fecha_hasta, now()::date)
    JOIN roma.clientes cli ON vta.clientes_id = cli.id
    JOIN personas prs ON cli.personas_id = prs.id
    JOIN factura_electronica.facturas_input fi ON fac.id = fi.facturas_id
    JOIN factura_electronica.respuesta_afip ra ON fi.id = ra.facturas_input_id
    WHERE fac.id = $1;
`;

exports.getDetalleFacturaImpresion = `
SELECT vtd.id as ventas_detalle_id,
		prd.descripcion_factura, prd.codigo,
        vtd.cantidad, vtd.monto, vtd.descuento, vtd.subtotal
        , vtd.monto_iva*vtd.cantidad as subtotal_iva
        , vtd.monto_neto*vtd.cantidad as subtotal_neto
FROM roma.facturas fac
JOIN roma.ventas vta ON fac.ventas_id = vta.id
JOIN roma.ventas_detalle vtd ON vtd.ventas_id = vta.id
JOIN roma.productos prd ON vtd.productos_id = prd.id
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