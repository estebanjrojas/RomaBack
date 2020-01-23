

//GET


//POST

exports.insertPersonaReturningId = `
INSERT INTO personas(
    nro_doc, tipo_doc, apellido, nombre, 
    telefono, telefono_cel, email, fecha_nac, 
    sexo, tipo_persona, fecha_create, 
    usuario, fecha_mov, usuario_carga
    fecha_carga, domicilios_id)
VALUES(
    $1, $2, $3, $4, 
    $5, $6, $7, $8, 
    $9, $10, now()
    $11, now(), $11, 
    now(), $12)
RETURNING id;`;

//PUT

exports.updatePersonas = `
UPDATE personas
SET 
    nro_doc = $1, 
    tipo_doc = $2, 
    apellido = $3, 
    nombre = $4, 
    telefono = $5, 
    telefono_cel = $6, 
    email = $7, 
    fecha_nac = $8, 
    sexo = $9, 
    tipo_persona = $10, 
    usuario = $11, 
    fecha_mov = now(), 
    domicilios_id = $13
WHERE id = $12`;

//DELETE

