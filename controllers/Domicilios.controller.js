const qDomicilios = require("./query/Domicilios");
const querySrv = require("../services/QueryService");

exports.getDomicilioByNroDoc = function (req, res) {
    querySrv.getQueryResults(qDomicilios.getDomicilioPersonaByNroDoc, [req.params.nro_doc])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getCalles = function (req, res) {
    querySrv.getQueryResults(qDomicilios.getCalles, [req.params.calles_nombre])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.getCallesEmpty = function (req, res) {
    querySrv.getQueryResults(qDomicilios.getCallesEmpty, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}

exports.insert = function (req, res) {
    //Parametros para insertar el domicilio
    let calle = (req.body.calle!=undefined)? `'`+req.body.calle+`'` : `null`;
    let numero = (req.body.numero!=undefined)? `'`+req.body.numero+`'` : `null`;
    let piso = (req.body.piso!=undefined)? `'`+req.body.piso+`'` : `null`;
    let depto = (req.body.depto!=undefined)? `'`+req.body.depto+`'` : `null`;
    let manzana = (req.body.manzana!=undefined)? `'`+req.body.manzana+`'` : `null`;
    let lote = (req.body.lote!=undefined)? `'`+req.body.lote+`'` : `null`;
    let block = (req.body.block!=undefined)? `'`+req.body.block+`'` : `null`;
    let barrio = (req.body.barrio!=undefined)? `'`+req.body.barrio+`'` : `null`;
    let ciudades_id = (req.body.ciudades_id!=undefined)? `'`+req.body.ciudades_id+`'` : `null`;

    querySrv.getQueryResults(qDomicilios.insertDomiciliosReturnIdFull, [calle, numero, piso, depto, manzana, lote, block, barrio, ciudades_id])
    .then(response => res.send({"domicilios_id" : response.value[0].id}))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error al cargar el domicilio ${err}` })));
}
