const querySrv = require("../services/QueryService");
const qPuntosVentas = require('./query/PuntosVentas.js');

exports.getPuntosVentaTodos = function (req, res) {
    querySrv.getQueryResults(qPuntosVentas.getPuntosVentaTodos, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"Ha ocurrido un error": err})));
}

exports.getPuntosVentaBusqueda = function (req, res) {
    querySrv.getQueryResults(qPuntosVentas.getPuntosVentaBusqueda, [req.params.texto_busqueda])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"Ha ocurrido un error": err})));
}

exports.getDatosPuntosVenta = function (req, res) {
    querySrv.getQueryResults(qPuntosVentas.getDatosPuntosVenta, [req.params.puntos_venta_id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"Ha ocurrido un error": err})));
}

exports.getCaracteristicasPuntosVenta = function (req, res) {
    querySrv.getQueryResults(qPuntosVentas.getCaracteristicasPuntosVenta, [req.params.puntos_venta_id])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"Ha ocurrido un error": err})));
}


exports.insertPuntoVentaReturnId = function (req, res) {
    let numero = (req.body.numero != undefined) ? req.body.numero : `null`;
    let nombre_usuario = (req.body.nombre_usuario != undefined) ? `'` + req.body.nombre_usuario + `'` : `null`;
    let sucursal = (req.body.sucursal != undefined) ? req.body.sucursal : `null`;
    let fecha_alta = (req.body.fecha_alta != undefined) ? `'` + req.body.fecha_alta + `'` : `now()::date`;

    querySrv.getQueryResults(qPuntosVentas.insertPuntoVentaReturnId, [numero, fecha_alta, sucursal])
    .then(response => res.send({ "mensaje": "El Producto fue guardado exitosamente", "id": response.value[0].id }))
    .catch(err => res.status(400).send(JSON.stringify({"Ha ocurrido un error": err})));
}

exports.insertCaracteristicasPuntoVenta = function (req, res) {
    querySrv.getQueryResults(qPuntosVentas.insertCaracteristicasPuntoVenta, [req.body.ultimo_nro, req.body.tipo, req.body.por_defecto,req.body.punto_venta_id])
    .then(response => res.send({ "mensaje": "Las Caracteristicas se cargaron exitosamente" }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje" : `Ha ocurrido un error al cargar las caracteristicas ${err}`})));
}

exports.actualizarDatosPuntoVenta = function (req, res) {
    let numero = (req.body.numero != undefined) ? req.body.numero : `null`;
    let nombre_usuario = (req.body.nombre_usuario != undefined) ? `'` + req.body.nombre_usuario + `'` : `null`;
    let sucursal = (req.body.sucursal != undefined) ? req.body.sucursal : `null`;
    let fecha_alta = (req.body.fecha_alta != undefined) ? `'` + req.body.fecha_alta + `'` : `now()::date`;

    querySrv.getQueryResults(qPuntosVentas.actualizarDatosPuntoVenta, [numero, fecha_alta, sucursal, req.body.id_punto_venta])
    .then(response => res.send({ "mensaje": "El punto de venta fue actualizado exitosamente", "id": response.value[0].id }))
    .catch(err => res.status(400).send(JSON.stringify({"Ha ocurrido un error": err})));
}

exports.eliminarCaracteristicasPuntoVenta = function (req, res) {
    querySrv.getQueryResults(qPuntosVentas.eliminarCaracteristicasPuntoVenta, [req.params.punto_venta_id])
    .then(response => res.send({ "mensaje": "El punto de venta se ha eliminado exitosamente"}))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje" : `Ha ocurrido un error ${err}`})));
}
