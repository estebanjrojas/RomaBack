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
    , CASE WHEN v.fecha_anulacion is not null THEN true ELSE false END as anulada
	, v.fecha_anulacion
	, v.usuario_anulacion
FROM roma.ventas v 
JOIN roma.clientes cli ON v.clientes_id = cli.id
JOIN personas per ON cli.personas_id = per.id
JOIN roma.empleados emp ON v.empleados_id = emp.id
JOIN personas per2 ON emp.personas_id = per2.id 
ORDER BY fecha desc, v.id
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
    , CASE WHEN v.fecha_anulacion is not null THEN true ELSE false END as anulada
	, v.fecha_anulacion
	, v.usuario_anulacion
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
ORDER BY fecha desc, v.id
`;


exports.getVentaPorId = `
SELECT v.id as ventas_id
    , cli.id as clientes_id
    , per.id as personas_id
    , v.fecha
    , per.nombre as nombre_cliente
    , per.apellido as apellido_cliente
    , per2.nombre as nombre_vendedor
    , per2.apellido as apellido_vendedor
    , v.monto_total as monto
    , CASE WHEN v.fecha_anulacion is not null THEN true ELSE false END as anulada
	, v.fecha_anulacion
    , v.usuario_anulacion
    , fac.id is not null as facturada
	, (fac.cae is not null OR fac.cai is not null) as aprobada
	, fac.id as facturas_id
	, gdt(5, fac.tipo_factura) as tipo_factura
	, fac.punto_venta_factura
	, fac.numero_factura
	, fac.fecha_emision as fecha_emision_factura
	, fac.monto_total as monto_total_factura
	, fac.monto_neto as monto_neto_factura
	, fac.monto_iva as monto_iva_factura
	, fac.cae
	, fac.fecha_vencimiento_cae
	, fac.cai
	, fac.fecha_vencimiento_cai
FROM roma.ventas v 
JOIN roma.clientes cli ON v.clientes_id = cli.id
JOIN personas per ON cli.personas_id = per.id
JOIN roma.empleados emp ON v.empleados_id = emp.id
JOIN personas per2 ON emp.personas_id = per2.id
LEFT JOIN roma.facturas fac ON v.id = fac.ventas_id
WHERE v.id = $1
ORDER BY fecha desc, v.id;
`;


exports.getDetalleVentaPorVentasId = `
SELECT vd.id as ventas_detalle_id, vd.cantidad
    , vd.monto as monto_unidad, vd.subtotal
	, pr.codigo, pr.nombre, pr.descripcion, pr.descripcion_factura
	, gdt(7, pr.tipo_producto) as tipo_producto
FROM roma.ventas_detalle vd
JOIN roma.productos pr ON vd.productos_id = pr.id
WHERE vd.ventas_id = $1;
`;

exports.getCantidadPaginasVentas = `
SELECT 
    count(*) as cantidad_registros,
    (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
FROM (
    SELECT v.id as ventas_id
        , cli.id as clientes_id
        , per.id as personas_id
        , v.fecha
        , per.nombre as nombre_cliente
        , per.apellido as apellido_cliente
        , per2.nombre as nombre_vendedor
        , per2.apellido as apellido_vendedor
        , v.monto_total as monto
        , CASE WHEN v.fecha_anulacion is not null THEN true ELSE false END as anulada
        , v.fecha_anulacion
        , v.usuario_anulacion
    FROM roma.ventas v 
    JOIN roma.clientes cli ON v.clientes_id = cli.id
    JOIN personas per ON cli.personas_id = per.id
    JOIN roma.empleados emp ON v.empleados_id = emp.id
    JOIN personas per2 ON emp.personas_id = per2.id 
)x
`;

exports.ventasDiariasEmpleados = `
SELECT emp.id as empleados_id, 
	TRIM(coalesce(prs.apellido, '')||' '||coalesce(prs.nombre, '')) as nombre,
	SUM(monto_total) as total_vendido
FROM roma.ventas vts
JOIN roma.empleados emp ON vts.empleados_id = emp.id
JOIN public.personas prs ON emp.personas_id = prs.id
WHERE vts.fecha = $1
AND vts.fecha_anulacion is null
GROUP BY emp.id, prs.apellido, prs.nombre
ORDER BY prs.apellido, prs.nombre, emp.id
`;

exports.ultimasVentas = `
SELECT vts.id, vts.monto_total, 
	sum(vdt.cantidad) as cantidad_articulos,
	vts.fecha,
	TRIM(coalesce(prs.apellido, '')||' '||coalesce(prs.nombre, '')) as empleado
FROM roma.ventas vts
JOIN roma.ventas_detalle vdt ON vts.id = vdt.ventas_id
JOIN roma.empleados emp ON vts.empleados_id = emp.id
JOIN public.personas prs ON emp.personas_id = prs.id
WHERE vts.fecha_anulacion is null
GROUP BY vts.id, vts.monto_total, vts.fecha, prs.apellido, prs.nombre
ORDER BY fecha desc , vts.id desc
LIMIT 5
`;

exports.ultimasVentasEmpleado = `
SELECT vts.id, vts.monto_total, 
	sum(vdt.cantidad) as cantidad_articulos,
	vts.fecha,
	TRIM(coalesce(prs.apellido, '')||' '||coalesce(prs.nombre, '')) as empleado
FROM roma.ventas vts
JOIN roma.ventas_detalle vdt ON vts.id = vdt.ventas_id
JOIN roma.empleados emp ON vts.empleados_id = emp.id
JOIN public.personas prs ON emp.personas_id = prs.id
WHERE vts.fecha_anulacion is null
AND emp.id = $1
GROUP BY vts.id, vts.monto_total, vts.fecha, prs.apellido, prs.nombre
ORDER BY fecha desc , vts.id desc
LIMIT 5
`;

exports.estadisticasVentasDiarias = `
select * 
from roma.get_estadisticas_ventas_diarias($1::date, $2::date);`;


exports.estadisticasVentasDiariasEmpleado = `
select * 
from roma.get_estadisticas_ventas_diarias($1::date, $2::date, $3::bigint);`;

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

exports.anularVenta = `
UPDATE roma.ventas SET fecha_anulacion = now(), usuario_anulacion = $1 WHERE id = $2;
`;
