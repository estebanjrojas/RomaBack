//Conexión a Postgres
const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;

async function generarTokenString(usuario, identificador) {
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });
        var token_generado = '';
        const client = await pool.connect();
       await client.query(`
            SELECT seguridad.generar_token('`+usuario+`', '`+identificador+`') as token_acceso;`
            , ((err, resp) => {
                if(err) console.log(err);
                token_generado = resp.rows[0].token_acceso;
                console.log("Token Generado en BD: "+token_generado);
                return token_generado;
            }))
    }
     catch(error) {
         return "ERROR: "+error;
     }
}


function generarToken(usuario, token_bd, llave_privada) {
    try {
        console.log(process.env);
        let token = jwt.sign({"token":token_bd}, llave_privada, {
            subject: usuario,
            expiresIn: 60 * 60 * 24 // expira en 24 horas
        })
        console.log(token);
         return token;
    } catch(err){
        console.log(err);
    }   
    
}

exports.solicitarAccesoUsuario = async function (req, res) {
    try{
        var pool = new Pool({
            connectionString: connectionString,
        });
       
          let acceso =  await pool.query(`
            SELECT count(*)>0 as permitir_acceso
            FROM seguridad.usuarios 
            WHERE pwd_usr = md5('`+ req.params.pswrd + `')
                AND nomb_usr = '`+ req.params.nomb_usr + `'
                AND habilitado = true
                AND coalesce(fecha_baja, now())>=now();
                `); 
            console.log(acceso.rows[0].permitir_acceso);

            if(acceso.rows[0].permitir_acceso) {
                let token_generado = generarTokenString(req.params.nomb_usr, req.params.pswrd).then(
                    function() {
                        res.status(200).send(JSON.stringify({ respuesta: generarToken(req.params.nomb_usr, token_generado, configuracion.llave) }));  
                    }
                ).catch(function(){
                    res.status(400).send(JSON.stringify({ "error": "Error al generar el token" }));
                })

            }
            else {
                res.status(400).send(JSON.stringify({ "error": "Usuario y/o contraseña incorrectos" }));
            }

    }catch(err)
    {
        res.status(400).send("{'error': 'Ocurrio un Error'}");
    }
};

