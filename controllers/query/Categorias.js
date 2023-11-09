exports.obtenerJSONTodasCategorias = `
SELECT roma.armar_json_completo_categorias() as categorias;
`;

exports.getCategoriasTodas = `
SELECT *, roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
FROM roma.categorias;
`;

exports.getCategoriasBusqueda = `
SELECT *
    , roma.get_nombre_categoria_padre(categorias_id_padre) as categorias_padre_descrip
FROM roma.categorias 
WHERE (nombre::varchar ilike '%' || $1 || '%'
        OR descripcion::varchar ilike '%' || $1 || '%'
        OR categorias_id_padre::varchar ilike '%' || $1 || '%')
`;

exports.getCantidadPaginasCategorias = `
SELECT 
    count(*) as cantidad_registros,
    (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
FROM (
    SELECT 
        *, 
        roma.get_nombre_categoria_padre(id) as categorias_padre_descrip
    FROM roma.categorias
)x
`;

exports.getCategorias = `
SELECT 
    *, 
    roma.get_nombre_categoria_padre(id) as categorias_padre_descrip
FROM roma.categorias
ORDER BY nombre
OFFSET (5* ((CASE 
    WHEN $1::integer > $2::integer THEN $2::integer
    WHEN $1::integer <1 THEN 1 
    ELSE $1::integer END) -1))
LIMIT 5
`;


exports.getDatosCategorias = `
SELECT 
    * 
FROM roma.categorias
WHERE 
    id = $1
`;


exports.insert = `
INSERT INTO roma.categorias(nombre, descripcion, categorias_id_padre)
VALUES($1, $2, $3) RETURNING id;
`;

exports.update = `
UPDATE roma.categorias SET nombre = $2, descripcion = $3, categorias_id_padre = $4
WHERE id = $1 RETURNING id;
`;

exports.delete = `
DELETE FROM roma.categorias
WHERE 
    id = $1 RETURNING 1;
`;


