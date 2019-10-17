//GET




//POST





//PUT


exports.updateClientesDomicilios = `
UPDATE roma.clientes
SET fecha_alta=$1, personas_id=$2
WHERE id = $3;
`


//DELETE