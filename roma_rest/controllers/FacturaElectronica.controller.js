const configuracion = require("../utillities/config");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const soap = require('soap');



exports.soap = function (req, res) {
    var url = 'http://www.dneonline.com/calculator.asmx?wsdl';
    var args = { intA: 100, intB: 300 };
    soap.createClient(url, function (err, client) {
        client.Add(args, function (err, result) {
            res.send({ respuesta: "operacion soap " + JSON.stringify(result) });
        });
    });
};