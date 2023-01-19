//GET
exports.getClientesTodos = `
SELECT cli.id as clientes_id, cli.fecha_alta, p.id as personas_id, p.* 
FROM roma.clientes cli
JOIN personas p ON cli.personas_id = p.id;
`;

exports.getClientesBusqueda = `
SELECT cli.id as clientes_id, *
FROM roma.clientes cli
JOIN personas p ON cli.personas_id = p.id 
WHERE (p.nro_doc::varchar ilike '%$1%'
		OR p.nombre::varchar ilike '%$1%'
		OR p.apellido ilike '%$1%');
`;

exports.getClientesWhere = `
SELECT cli.id as clientes_id, cli.fecha_alta
	, p.*, tdc.descripcion as tipo_doc_descrip
	, dm.calle, dm.numero as domicilio_numero
	, dm.piso, dm.depto, dm.manzana, dm.lote, dm.block, dm.barrio, dm.ciudades_id
	, cl.codigo_postal, cl.nombre as ciudad_nombre
	, pv.id as provincias_id, pv.nombre as provincias_nombre
	, pc.id as paices_id, pc.nombre as pais_nombre
FROM roma.clientes cli
JOIN personas p ON cli.personas_id = p.id
JOIN tipos_documento tdc ON p.tipo_doc = tdc.id
LEFT JOIN domicilios dm ON p.domicilios_id = dm.id
LEFT JOIN ciudades cl ON dm.ciudades_id = cl.id
LEFT JOIN provincias pv ON cl.provincias_id = pv.id
LEFT JOIN paises pc ON pv.paises_id = pc.id 
WHERE CASE 
		WHEN $1::varchar = '1' THEN p.apellido::varchar ilike '%' || $2 || '%'
		WHEN $1::varchar = '2' THEN p.nombre::varchar ilike '%' || $2 || '%'
		WHEN $1::varchar = '3' THEN p.nro_doc::varchar ilike '%' || $2 || '%'
	END
`;

exports.getDatosClientePorId = `
SELECT cli.id as clientes_id
	, cli.personas_id
	, ps.*
	, dom.*
	, ciu.id as ciudades_id
	, ciu.nombre as ciudad_nombre
	, prov.id as provincias_id
	, ps.id as personas_id
	, dom.id as domicilios_id
FROM roma.clientes cli
LEFT JOIN personas ps ON cli.personas_id = ps.id
LEFT JOIN domicilios dom ON ps.domicilios_id = dom.id
LEFT JOIN ciudades ciu ON dom.ciudades_id = ciu.id
LEFT JOIN provincias prov ON ciu.provincias_id = prov.id
WHERE cli.id = $1;
`;

exports.getCantidadPaginasClientes = `
SELECT 
	COUNT(*) as cantidad_registros,
	(COUNT(*)/20 )+ (CASE WHEN COUNT(*) % 20 >0 THEN 1 ELSE 0 END) AS cantidad_paginas
FROM (
	SELECT cli.id as clientes_id, cli.fecha_alta, p.id as personas_id, p.* 
	FROM roma.clientes cli
	JOIN personas p ON cli.personas_id = p.id
)x
`;

exports.getClientes = `
SELECT cli.id as clientes_id, cli.fecha_alta, p.id as personas_id, p.* 
FROM roma.clientes cli
JOIN personas p ON cli.personas_id = p.id 
OFFSET (20* ((CASE 
	WHEN $1::integer > $2::integer THEN $2::integer
	WHEN $1::integer <1 THEN 1 
	ELSE $1::integer END) -1))
LIMIT 20
`;

//POST

exports.insertClienteReturnId = `
INSERT INTO roma.clientes(
	fecha_alta, personas_id)
	VALUES (now(), $1);
`



//PUT


exports.updateClientesDomicilios = `
UPDATE roma.clientes
SET personas_id=$1
WHERE id = $2;
`


//DELETE