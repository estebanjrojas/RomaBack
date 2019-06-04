exports.insertPersonaReturningId = `
INSERT INTO personas(nro_doc, tipo_doc
    , apellido, nombre
    , telefono, telefono_cel, email
    , fecha_nac, sexo, tipo_persona
    , fecha_create, ip, usuario, fecha_mov
    , estado_civil
    , fecha_cese, usuario_carga, ip_carga, fecha_carga
    , telefono_caracteristica, celular_caracteristica
    , domicilios_id)
VALUES($1, $2
    , $3, $4
    , $5, $6, $7
    , $8, $9, $10
    , now(), $11, $12, now()
    , $13
    , $14, $15, $16, $17
    , $18, $19
    , $20)
RETURNING id;`;

exports.updatePersonas = `
UPDATE personas
SET nro_doc = $1
    , tipo_doc = $2
    , apellido = $3, nombre = $4
    , telefono = $5, telefono_cel = $6, email = $7
    , fecha_nac = $8, sexo = $9, tipo_persona = $10
    , ip = $11, usuario = $12, fecha_mov = now()
    , estado_civil = $13
    , fecha_cese = $14
    , telefono_caracteristica = $15, celular_caracteristica = $16
    , domicilios_id = $17
WHERE id = $18`;