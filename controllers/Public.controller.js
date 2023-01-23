const qPublic = require('./query/Public.js');
const querySrv = require("../services/QueryService");

exports.selectAllCiudades = function (req, res) {
    querySrv.getQueryResults(qPublic.selectAllCiudades, [])
    .then(response => res.send(JSON.stringify(response.value)))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));  
}
