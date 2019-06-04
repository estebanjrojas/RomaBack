exports.insertDomiciliosReturnId = `
INSERT INTO domicilios(calle, numero, piso, depto, manzana, lote, block, barrio, ciudades_id)
VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)
RETURNING id;`;

exports.updateDomicilio = `
UPDATE domicilios
SET calle = $1
    , numero = $2
    , piso = $3
    , depto = $4
    , manzana = $5
    , lote = $6
    , block = $7
    , barrio = $8
    , ciudades_id = $9
WHERE id = $10`;