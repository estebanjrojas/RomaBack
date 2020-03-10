exports.getProductosTodos = `
SELECT p.id as productos_id
    ,  p.*
    , pc.*
    , cat.nombre as nombre_categoria
    , roma.get_imagen_principal_producto(p.id) as imagen
FROM roma.productos p
JOIN roma.productos_categorias pc ON p.id = pc.productos_id
JOIN roma.categorias cat ON pc.categorias_id = cat.id
`;

exports.getProductosBusqueda = `
SELECT p.id as productos_id
    ,  p.*
    , pc.*
    , cat.nombre as nombre_categoria
    , roma.get_imagen_principal_producto(p.id) as imagen
FROM roma.productos p
JOIN roma.productos_categorias pc ON p.id = pc.productos_id
JOIN roma.categorias cat ON pc.categorias_id = cat.id
WHERE (p.codigo::varchar ilike '%'||$1||'%'
        OR p.nombre ilike '%'||$1||'%'
        OR descripcion ilike '%'||$1||'%'
        OR cat.nombre ilike '%'||$1||'%'
        OR tipo_producto) ilike '%'||$1||'%');
`;

exports.getDatosProductos = `
SELECT *, roma.get_imagen_principal_producto(pr.id) as imagen
FROM roma.productos pr
JOIN roma.precios_productos prp ON pr.id = prp.productos_id             
WHERE pr.id = $1;
`;

exports.getCaracteristicasProductos = `
SELECT * 
FROM roma.productos_caracteristicas             
WHERE productos_id = $1;
`;

exports.getCategoriasProductos = `
SELECT cat.id as categorias_id, cat.nombre
, roma.get_nombre_categoria_padre(cat.id) as categoria_padre 
FROM roma.productos_categorias pc
JOIN roma.categorias cat ON pc.categorias_id = cat.id    
WHERE productos_id = $1
`;

exports.getUltimoPrecioValido = `
SELECT *
FROM roma.precios_productos    
WHERE productos_id = $1 AND now()::date 
    BETWEEN fecha_desde AND coalesce(fecha_hasta, now())::date;
`;

exports.getHistorialPrecios = `
SELECT *
FROM roma.precios_productos    
WHERE productos_id = $1
`;

exports.getImagenesProductos = `
SELECT *, case when principal=true then 1 else 0 end as orden
FROM roma.productos_imagenes
WHERE productos_id = $1
ORDER BY orden DESC;
`;

exports.getProductosPorCategoriaCampoBusqueda = `
SELECT prod.id as productos_id
        , prod.codigo, prod.nombre, prod.descripcion, prod.descripcion_factura
        , prod.tipo_producto, gdt(7, prod.tipo_producto) as tipo_producto_descrip
        , prod.fecha_desde, prod.fecha_hasta
        , roma.get_imagen_principal_producto(prod.id) as imagen_principal
        , ppre.monto as precio
        , ppre.unidad as moneda
FROM roma.productos prod
LEFT JOIN roma.productos_categorias pcat ON prod.id = pcat.productos_id
LEFT JOIN roma.precios_productos ppre ON prod.id = ppre.productos_id AND now()::date between ppre.fecha_desde and coalesce(ppre.fecha_hasta, now())::date
WHERE (pcat.categorias_id = $1 OR $1 = 0)
AND CASE $2
    WHEN 'nombre' THEN prod.nombre ilike '%'||$3||'%' END
    WHEN 'descripcion' THEN prod.descripcion ilike '%'||$3||'%' END
    WHEN 'descripcion_factura' THEN prod.descripcion_factura ilike '%'||$3||'%' END
    WHEN 'codigo' THEN prod.codigo ilike '%'||$3||'%' END
AND coalesce(prod.fecha_hasta, now())::date >= now()::date
GROUP BY prod.id, prod.codigo, prod.nombre, prod.descripcion, prod.descripcion_factura
, prod.tipo_producto, prod.fecha_desde, prod.fecha_hasta
, ppre.monto, ppre.unidad
`;

exports.getFotosCargadas = `
SELECT *
FROM roma.productos_imagenes
WHERE productos_id = $1
`;

exports.getCantidadPaginasProductos = `
SELECT COUNT(*) as cantidad_registros,
    (COUNT(*)/5 )+ (CASE WHEN COUNT(*) % 5 >0 THEN 1 ELSE 0 END) AS cantidad_paginas
FROM (
    SELECT 
            p.id as productos_id
        ,  p.*
        , pc.*
        , cat.nombre as nombre_categoria
        , roma.get_imagen_principal_producto(p.id) as imagen
    FROM roma.productos p
    JOIN roma.productos_categorias pc ON p.id = pc.productos_id
    JOIN roma.categorias cat ON pc.categorias_id = cat.id
)x
`;

exports.insertProductosReturningId = `
INSERT INTO roma.productos (codigo, nombre, descripcion, descripcion_factura, tipo_producto, fecha_desde)
VALUES($1, $2, $3, $4, $5, now()::date) RETURNING id; 
`;

exports.insertPreciosProductos = `
INSERT INTO roma.precios_productos(monto, unidad, fecha_desde, productos_id)
VALUES($1, $2, now(), $3)
`;