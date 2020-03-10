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