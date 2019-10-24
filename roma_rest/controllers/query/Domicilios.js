exports.insertDomiciliosReturnId = `
INSERT INTO domicilios(calle, numero, piso, depto, manzana, ciudades_id)
VALUES($1, $2, $3, $4, $5, $6)
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
WHERE id = $7`;