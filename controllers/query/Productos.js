exports.getProductosTodos = `
SELECT p.id as productos_id
    ,  p.*
    , pc.*
    , cat.nombre as nombre_categoria
    , roma.get_imagen_principal_producto(p.id) as imagen
FROM roma.productos p
JOIN roma.productos_categorias pc ON p.id = pc.productos_id
JOIN roma.categorias cat ON pc.categorias_id = cat.id
WHERE p.fecha_hasta IS null;
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
        OR tipo_producto) ilike '%'||$1||'%')
        AND p.fecha_hasta IS null;
`;

exports.insertarNuevoProducto = `
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
        , prod.tipo_producto, tp.descripcion as tipo_producto_descrip
        , prod.fecha_desde, prod.fecha_hasta
        , roma.get_imagen_principal_producto(prod.id) as imagen_principal
        , ppre.monto as precio
        , ppre.unidad as moneda
FROM roma.productos prod
JOIN roma.tipos_productos tp ON prod.tipo_producto = tp.id
LEFT JOIN roma.productos_categorias pcat ON prod.id = pcat.productos_id
LEFT JOIN roma.precios_productos ppre ON prod.id = ppre.productos_id AND now()::date between ppre.fecha_desde and coalesce(ppre.fecha_hasta, now())::date
WHERE (pcat.categorias_id = $1 OR $1 = 0)
AND CASE 
    WHEN $2 ilike 'nombre' THEN prod.nombre ilike '%'||$3||'%' 
    WHEN $2 ilike 'descripcion' THEN prod.descripcion ilike '%'||$3||'%' 
    WHEN $2 ilike 'descripcion_factura' THEN prod.descripcion_factura ilike '%'||$3||'%' 
    WHEN $2 ilike 'codigo' THEN prod.codigo ilike '%'||$3||'%' END
AND coalesce(prod.fecha_hasta, now())::date >= now()::date
GROUP BY prod.id, prod.codigo, prod.nombre, prod.descripcion, prod.descripcion_factura
, prod.tipo_producto, prod.fecha_desde, prod.fecha_hasta
, ppre.monto, ppre.unidad, tp.descripcion
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

exports.getProductos = `
SELECT p.id as productos_id
        ,  p.*
        , pc.*
        , cat.nombre as nombre_categoria
        , roma.get_imagen_principal_producto(p.id) as imagen
FROM roma.productos p
JOIN roma.productos_categorias pc ON p.id = pc.productos_id
JOIN roma.categorias cat ON pc.categorias_id = cat.id 
OFFSET (5* ((CASE 
    WHEN $1::integer > $2::integer THEN  $2::integer 
    WHEN $1::integer <1 THEN 1 
    ELSE $1::integer END) -1))
LIMIT 5`;

exports.getNovedadesProductosLimit = `
SELECT * 
FROM roma.get_novedades_productos($1, $2)
ORDER BY _fecha desc, _tipo, _descripcion
LIMIT $3;
`;

exports.verificarProductoPoseeCaracteristicas = `
SELECT count(id)>0 as respuesta
FROM roma.productos_caracteristicas
WHERE
    productos_id = $1
`;

exports.verificarProductoPoseeImagenes = `
SELECT count(id)>0 as respuesta
FROM roma.productos_imagenes
WHERE
    productos_id = $1
`;

exports.getTiposProductos = `SELECT * FROM roma.tipos_productos`;

//POST

exports.insertProductosReturningId = `
INSERT INTO roma.productos (codigo, nombre, descripcion, descripcion_factura, tipo_producto, fecha_desde)
VALUES($1, $2, $3, $4, $5, now()::date) RETURNING id; 
`;

exports.insertPreciosProductos = `
INSERT INTO roma.precios_productos(monto, unidad, fecha_desde, productos_id)
VALUES($1, $2, now(), $3)
`;

exports.insertNuevoPrecioProducto = `
INSERT INTO roma.precios_productos(monto, fecha_desde, productos_id)
VALUES($1, now()::date + INTERVAL '1 DAY', $2);
`;

exports.insertCaracteristicasProducto = `
INSERT INTO roma.productos_caracteristicas(nombre, descripcion, valor, productos_id)
VALUES($1, $2, $3, $4::bigint);
`;


exports.insertCategoriasProducto = `
INSERT INTO roma.productos_categorias(productos_id, categorias_id)
VALUES($1::bigint, $2);
`;

exports.insertImagenesProducto = `
INSERT INTO roma.productos_imagenes(productos_id, imagen, fecha_carga, principal)
VALUES($1, $2, now(), $3);
`;


//PUT
exports.actualizarFechaHastaPrecio = `
UPDATE roma.precios_productos SET fecha_hasta= now()::date WHERE productos_id = $1;`;


exports.actualizarDatosProductos = `
UPDATE roma.productos 
SET 
    codigo = $1,
    nombre = $2,
    descripcion = $3,
    descripcion_factura = $4,
    tipo_producto = $5,
    fecha_desde = now()::date
WHERE 
    id=$6::bigint;
`;

exports.actualizarPreciosProductos = `
UPDATE roma.precios_productos
SET 
    monto = $1,
    unidad = $2,
    fecha_desde = now()
WHERE 
    productos_id= $3::bigint;
`;




//DELETE
exports.eliminarCategoriasProductos = `
DELETE FROM roma.productos_categorias 
WHERE productos_id = $1 
`;
exports.eliminarPreciosProductos = `
DELETE FROM roma.precios_productos
WHERE productos_id = $1 
`;

exports.eliminarCaracteristicasProductos = `
DELETE FROM roma.productos_caracteristicas WHERE productos_id = $1 RETURNING 1;
`;

exports.eliminarImagenesProductos = `
DELETE FROM roma.productos_imagenes WHERE productos_id = $1 RETURNING 1`;

exports.eliminarProductoById = `
UPDATE roma.productos SET fecha_hasta = now() WHERE id = $1 RETURNING 1`;


