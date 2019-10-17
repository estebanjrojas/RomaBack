exports.getPuntosVentaTodos = `
SELECT pv.*
    , tab.descrip as sucursal_descrip
FROM roma.puntos_venta pv
JOIN tabgral tab ON pv.sucursal = tab.codigo AND tab.nro_tab = 6
`;

exports.getPuntosVentaBusqueda = `
SELECT pv.*
    , tab.descrip as sucursal_descrip
FROM roma.puntos_venta pv
JOIN tabgral tab ON pv.sucursal = tab.codigo AND tab.nro_tab = 6
WHERE (tab.descrip ilike '%||$1||%'
    OR tab.codigo::varchar '$||$1||%'
    OR pv.numero::varchar ilike '%||$1||%')
`;

exports.getDatosPuntosVenta = `
SELECT *
FROM roma.puntos_venta pv            
WHERE pv.id = $1
`;

exports.getCaracteristicasPuntosVenta = `
SELECT *, gdt(6, tipo_comprobante) as descripcion 
FROM roma.puntos_venta_tipo_comprobantes             
WHERE puntos_venta_id = $1
`;

exports.insertPuntoVentaReturnId = `
INSERT INTO roma.puntos_venta (numero, fecha_alta, sucursal)
VALUES($1, $2, $3) RETURNING id;
`;

exports.insertCaracteristicasPuntoVenta = `
INSERT INTO roma.puntos_venta_tipo_comprobantes(ultimo_numero, tipo_comprobante, defecto, puntos_venta_id)
VALUES($1, $2, $3, $4)
`;

exports.actualizarDatosPuntoVenta = `
UPDATE roma.puntos_venta
SET numero = $1, 
    fecha_alta = $2, 
    sucursal = $3
WHERE id = $4 RETURNING id;
`;

exports.eliminarCaracteristicasPuntoVenta = `
DELETE FROM roma.puntos_venta_tipo_comprobantes
WHERE puntos_venta_id = $1
`;