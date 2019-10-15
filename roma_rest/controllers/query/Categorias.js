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

exports.insert = `
INSERT INTO roma.categorias(nombre, descripcion, categorias_id_padre)
VALUES($1, $2, $3) RETURNING id;
`;

exports.update = `
UPDATE roma.categorias SET nombre = $2, descripcion = $3, categorias_id_padre = $4
WHERE id = $1;
`;