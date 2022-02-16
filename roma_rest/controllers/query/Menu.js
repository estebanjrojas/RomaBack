exports.getMenu = `SELECT seguridad.get_apmenu($1) as menu`;

exports.getPerfilesCodificadosMenu = `
SELECT ENCODE(digest(LOWER(prf.nombre),'sha256'),'hex') as perfiles
FROM seguridad.perfiles prf
JOIN seguridad.perfiles_menu pmu ON prf.id = pmu.perfiles_id
JOIN seguridad.menu mnu ON pmu.menu_id = mnu.id
WHERE replace(mnu.router_link, '/', '') ilike '%'||$1||'%'
`;
