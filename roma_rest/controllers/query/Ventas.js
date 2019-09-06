exports.getVentasTodas = `
SELECT v.id as ventas_id
    , cli.id as clientes_id
    , per.id as personas_id
    , v.fecha
    , per.nombre as nombre_cliente
    , per.apellido as apellido_cliente
    , per2.nombre as nombre_vendedor
    , per2.apellido as apellido_vendedor
    , v.monto_total as monto
FROM roma.ventas v 
JOIN roma.clientes cli ON v.clientes_id = cli.id
JOIN personas per ON cli.personas_id = per.id
JOIN roma.empleados emp ON v.empleados_id = emp.id
JOIN personas per2 ON emp.personas_id = per2.id 
`;

exports.getVentasBusqueda = `
SELECT v.id as ventas_id
    , cli.id as clientes_id
    , per.id as personas_id
    , v.fecha
    , per.nombre as nombre_cliente
    , per.apellido as apellido_cliente
    , per2.nombre as nombre_vendedor
    , per2.apellido as apellido_vendedor
    , v.monto_total as monto
FROM roma.ventas v 
JOIN roma.clientes cli ON v.clientes_id = cli.id
JOIN personas per ON cli.personas_id = per.id
JOIN roma.empleados emp ON v.empleados_id = emp.id
JOIN personas per2 ON emp.personas_id = per2.id
WHERE (per.nombre::varchar ilike '%' || $1 || '%'
        OR per.apellido::varchar ilike '%' || $1 || '%'
        OR per2.nombre::varchar ilike '%' || $1 || '%'
        OR per2.apellido::varchar ilike '%' || $1 || '%'
        OR v.monto_total::varchar ilike '%' || $1 || '%')
`;

exports.insertReturnId = `
INSERT INTO roma.ventas(fecha, monto_total, empresas_id, empleados_id, clientes_id)
VALUES(now()::date, $1, $2, $3, $4)
RETURNING id;
`;

exports.insertDetalleReturnId = `
INSERT INTO roma.ventas_detalle(cantidad, monto, descuento, subtotal, ventas_id, productos_id)
VALUES($1, $2, $3, $4, $5, $6)
RETURNING id;
`;

