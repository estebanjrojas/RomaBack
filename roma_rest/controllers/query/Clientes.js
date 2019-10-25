//GET




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