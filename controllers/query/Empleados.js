
exports.getEmpleadosTodos = `
SELECT em.id as empleados_id
    , em.personas_id
    , em.legajo
    , em.fecha_ingreso
    , em.descripcion
    , ofc.descripcion as oficina
    , ep.id as empresas_id
    , ep.razon_social as empresa_razon_social
    , ep.nombre_fantasia as empresa_nombre_fantasia
    , ps.*
FROM roma.empleados em
JOIN roma.oficinas ofc ON em.oficina = ofc.id
JOIN personas ps ON em.personas_id = ps.id
JOIN roma.empresas ep ON em.empresas_id = ep.id`;

exports.getEmpleadosBusqueda = `
SELECT em.id as empleados_id
    , em.personas_id
    , em.legajo
    , em.fecha_ingreso
    , em.descripcion
    , ofc.descripcion as oficina
    , ep.id as empresas_id
    , ep.razon_social as empresa_razon_social
    , ep.nombre_fantasia as empresa_nombre_fantasia
    , ps.*
FROM roma.empleados em
JOIN roma.oficinas ofc ON em.oficina = ofc.id
JOIN personas ps ON em.personas_id = ps.id
JOIN roma.empresas ep ON em.empresas_id = ep.id
WHERE (ps.nro_doc::varchar ilike '%' || $1 || '%'
        OR ps.apellido ilike '%' || $1 || '%'
        OR ps.nombre ilike '%' || $1 || '%'
        OR ofc.descripcion ilike '%' || $1 || '%');`;


exports.getEmpleadoPorNroDoc = `
SELECT em.id as empleados_id
            , em.personas_id
            , em.legajo
            , em.fecha_ingreso
            , em.descripcion
            , ofc.descripcion as oficina
            , em.oficina as oficinas_id
            , ep.id as empresas_id
            , ep.razon_social as empresa_razon_social
            , ep.nombre_fantasia as empresa_nombre_fantasia
            , ps.*
FROM roma.empleados em
JOIN roma.oficinas ofc ON em.oficina = ofc.id
JOIN personas ps ON em.personas_id = ps.id
JOIN roma.empresas ep ON em.empresas_id = ep.id
WHERE tipo_doc = $1 AND nro_doc = $2`;

exports.getDatosEmpleadoPorId = `
SELECT em.id as empleados_id
    , em.personas_id
    , em.legajo
    , em.fecha_ingreso
    , em.descripcion
    , ofc.descripcion as oficina
    , em.oficina as oficinas_id
    , ep.id as empresas_id
    , ep.razon_social as empresa_razon_social
    , ep.nombre_fantasia as empresa_nombre_fantasia
    , ps.*
    , dom.id as domicilios_id
    , dom.calle as domicilio_calle
    , dom.numero as domicilio_numero
    , dom.piso as domicilio_piso
    , dom.depto as domicilio_depto
    , dom.manzana as domicilio_manzana
    , dom.lote as domicilio_lote
    , dom.block as domicilio_block
    , dom.barrio as domicilio_barrio
    , dom.ciudades_id as domicilio_ciudades_id
    , ciu.nombre as domicilio_ciudad
    , ciu.codigo_postal as domicilio_codigo_postal
    , prv.id as domicilio_provincias_id
    , prv.nombre as domicilio_provincia
    , pai.id as domicilio_paises_id
    , pai.nombre as domicilio_pais
FROM roma.empleados em
JOIN roma.oficinas ofc ON em.oficina = ofc.id
JOIN personas ps ON em.personas_id = ps.id
JOIN roma.empresas ep ON em.empresas_id = ep.id
LEFT JOIN domicilios dom ON ps.domicilios_id = dom.id
LEFT JOIN ciudades ciu ON dom.ciudades_id = ciu.id
LEFT JOIN provincias prv ON ciu.provincias_id = prv.id
LEFT JOIN paises pai ON prv.paises_id = pai.id
WHERE em.id = $1
`;


exports.getEmpleadosSinUsuario = `
SELECT em.id as empleados_id
    , em.personas_id
    , em.legajo
    , em.fecha_ingreso
    , em.descripcion
    , ofc.descripcion as oficina
    , ep.id as empresas_id
    , ep.razon_social as empresa_razon_social
    , ep.nombre_fantasia as empresa_nombre_fantasia
    , ps.*
    , usr.nomb_usr
    , ps.nombre || ' ' || ps.apellido as nombre_completo
FROM roma.empleados em
JOIN roma.oficinas ofc ON em.oficina = ofc.id
JOIN personas ps ON em.personas_id = ps.id
JOIN roma.empresas ep ON em.empresas_id = ep.id
LEFT JOIN seguridad.usuarios usr ON ps.id = usr.personas_id
WHERE usr.nomb_usr is null
`;

exports.getCantidadPaginasEmpleados = `
SELECT 
    count(*) as cantidad_registros,
    (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
FROM (
    SELECT em.id as empleados_id
        , em.personas_id
        , em.legajo
        , em.fecha_ingreso
        , em.descripcion
        , ofc.descripcion as oficina
        , ep.id as empresas_id
        , ep.razon_social as empresa_razon_social
        , ep.nombre_fantasia as empresa_nombre_fantasia
        , ps.*
    FROM roma.empleados em
    JOIN roma.oficinas ofc ON em.oficina = ofc.id
    JOIN personas ps ON em.personas_id = ps.id
    JOIN roma.empresas ep ON em.empresas_id = ep.id
)x
`;

exports.getEmpleados = `
SELECT 
    em.id as empleados_id
    , em.personas_id
    , em.legajo
    , em.fecha_ingreso
    , em.descripcion
    , of.descripcion as oficina
    , ep.id as empresas_id
    , ep.razon_social as empresa_razon_social
    , ep.nombre_fantasia as empresa_nombre_fantasia
    , ps.*
FROM roma.empleados em
JOIN personas ps ON em.personas_id = ps.id
JOIN roma.empresas ep ON em.empresas_id = ep.id
JOIN roma.oficinas of ON em.oficina = of.id
ORDER BY ps.apellido, ps.nombre
OFFSET (5* ((CASE 
    WHEN $1::integer > $1::integer THEN $2::integer
    WHEN $1::integer <1 THEN 1 
    ELSE $1::integer END) -1))
LIMIT 5
`;

exports.getOficinas = `
SELECT 
    *
FROM roma.oficinas;
`;

exports.insertEmpleadoReturnId = `
INSERT INTO roma.empleados(personas_id, legajo, fecha_ingreso, descripcion, empresas_id, oficina)
VALUES($1, $2, $3, $4, $5, $6) RETURNING id; `;

exports.updateEmpleado = `
UPDATE roma.empleados
SET personas_id = $1, legajo = $2, fecha_ingreso = $3, descripcion = $4, empresas_id = $5, oficina = $6
WHERE id = $7`;


//DELETE

exports.deleteEmpleado = `
UPDATE roma.empleados SET fecha_egreso = now() WHERE id = $1 RETURNING 1
`;