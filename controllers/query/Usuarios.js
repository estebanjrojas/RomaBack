//GET

exports.generarTokenString = `
    SELECT seguridad.generar_token($1, $2) as token_acceso;
`;

exports.solicitarAccesoUsuario = `
    SELECT count(*)>0 as permitir_acceso
    FROM seguridad.usuarios 
    WHERE pwd_usr = ENCODE(digest(LOWER($1),'sha256'),'hex')
        AND nomb_usr = $2
        AND habilitado = true
        AND coalesce(fecha_baja, now())>=now();
`;



exports.getDatosUsuario = `
SELECT usr.nomb_usr as usuario
    , usr.desc_usr as descripcion_usuario
    , usr.debug
    , prs.apellido
    , prs.nombre
    , prs.email
    , prs.nro_doc
    , emp.legajo
    , emp.descripcion as descripcion_empleado
    , emp.id as empleados_id
    , emp.empresas_id
    , emp.fecha_ingreso
FROM seguridad.usuarios usr
JOIN public.personas prs ON usr.personas_id = prs.id
JOIN roma.empleados emp ON emp.personas_id = prs.id
WHERE usr.nomb_usr =  $1;
`;

exports.getUsuariosTodos = `
SELECT * 
FROM seguridad.usuarios usr
JOIN public.personas p ON usr.personas_id = p.id 
`;

exports.getUsuariosBusqueda = `
SELECT *
FROM seguridad.usuarios usr
JOIN public.personas p ON usr.personas_id = p.id
WHERE (p.nombre::varchar ilike '%' || $1 || '%'
        OR p.apellido::varchar ilike '%' || $1 || '%'
        OR usr.nomb_usr ilike '%' || $1 || '%'
        OR usr.desc_usr ilike '%' || $1 || '%'
        OR p.nro_doc::varchar ilike '%' || $1 || '%')
`;


exports.getDatosUsuariosCargados = `
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
    , ps.nombre || ' ' || ps.apellido as nombre_completo
    , usr.nomb_usr
    , usr.id as usuario_id
FROM roma.empleados em
JOIN roma.oficinas ofc ON em.oficina = ofc.id
JOIN personas ps ON em.personas_id = ps.id
JOIN roma.empresas ep ON em.empresas_id = ep.id
JOIN seguridad.usuarios usr ON ps.id = usr.personas_id          
WHERE usr.id = $1;
`;

exports.getPerfilesAsignados = `
SELECT per.id
    , per.nombre
    , per.descripcion 
FROM seguridad.usuarios_perfiles up 
JOIN seguridad.perfiles per ON up.perfiles_id = per.id
JOIN seguridad.usuarios u ON up.usuarios_id = u.id
JOIN personas p ON u.personas_id = p.id
JOIN roma.empleados emp ON p.id = emp.personas_id
WHERE emp.id = $1
`;

exports.getPerfilesSinAsignar = `
SELECT * 
FROM seguridad.perfiles 
WHERE id not in (
    SELECT 
        perf.id 
    FROM seguridad.perfiles perf
    JOIN seguridad.usuarios_perfiles up ON perf.id = up.perfiles_id
    JOIN seguridad.usuarios usr ON up.usuarios_id = usr.id
    JOIN personas p ON usr.personas_id = p.id
    JOIN roma.empleados emp ON p.id = emp.personas_id
    WHERE emp.id in ($1)
);
`;

exports.getCantidadPaginasUsuarios = `
SELECT 
    count(*) as cantidad_registros,
    (count(*)/5 )+ (case when count(*) % 5 >0 then 1 else 0 end) as cantidad_paginas
FROM (
    SELECT 
        * 
    FROM seguridad.usuarios usr
    JOIN public.personas ps ON usr.personas_id = ps.id 
)x
`;

exports.deletePerfilesDelUsuario = `
DELETE FROM seguridad.usuarios_perfiles 
WHERE usuarios_id = $1;
`;

exports.getPerfilesCodificadosUsuario = `
SELECT ENCODE(digest(LOWER(prf.nombre),'sha256'),'hex') as perfiles
FROM seguridad.perfiles prf
JOIN seguridad.usuarios_perfiles upf ON prf.id = upf.perfiles_id
JOIN seguridad.usuarios usr ON upf.usuarios_id = usr.id
WHERE usr.nomb_usr = $1
`;


//POST

exports.insertUsuarioReturnId = `
INSERT INTO seguridad.usuarios (nomb_usr, pwd_usr, debug, personas_id)
VALUES($1, ENCODE(digest(LOWER($1::varchar),'sha256'),'hex'), $2, $3) RETURNING id;
`;

exports.insertPerfilesAsignados = `
INSERT INTO seguridad.usuarios_perfiles(usuarios_id, perfiles_id)
VALUES($1, $2)  RETURNING id;
`;


//PUT

exports.cambiarPassword = `
UPDATE seguridad.usuarios
        SET pwd_usr = ENCODE(digest(LOWER($1),'sha256'),'hex')
WHERE nomb_usr = $2 RETURNING id;
`;