

//GET


//POST

exports.insertPersonaReturningId = `
INSERT INTO personas(
    nro_doc, tipo_doc, apellido, nombre, 
    telefono, telefono_cel, email, fecha_nac, 
    sexo, tipo_persona, fecha_create, ip, 
    usuario, fecha_mov, usuario_carga, ip_carga, 
    fecha_carga, domicilios_id)
VALUES(
    $1, $2, $3, $4, 
    $5, $6, $7, $8, 
    $9, $10, now(), $11, 
    $12, now(), $12, $11, 
    now(), $13)
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
    ip = $11, 
    usuario = $12, 
    fecha_mov = now(), 
    domicilios_id = $14
WHERE id = $13`;

//DELETE

