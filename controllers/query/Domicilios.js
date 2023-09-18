exports.insertDomiciliosReturnId = `
INSERT INTO domicilios(calle, numero, piso, depto, manzana, ciudades_id)
VALUES($1, $2, $3, $4, $5, $6)
RETURNING id;`;

exports.insertDomiciliosReturnIdFull = `
INSERT INTO domicilios(calle, numero, piso, depto, manzana, lote, block, barrio, ciudades_id)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id;`;

exports.updateDomicilio = `
UPDATE domicilios
SET 
    calle = $1, 
    numero = $2, 
    piso = $3, 
    depto = $4, 
    manzana = $5, 
    ciudades_id = $6
WHERE id = $7
RETURNING id`;

exports.getDomicilioPersonaByNroDoc = `
SELECT * 
FROM personas prs
JOIN domicilios dom on prs.domicilios_id = dom.id
JOIN ciudades ciu on dom.ciudades_id = ciu.id
WHERE prs.nro_doc = $1;
`;

exports.getCalles = `
SELECT *
FROM calles
WHERE nombre ilike '%$1%' 
ORDER BY nombre
LIMIT 5
`;

exports.getCallesEmpty = `
SELECT *
FROM calles
ORDER BY nombre
LIMIT 5
`;