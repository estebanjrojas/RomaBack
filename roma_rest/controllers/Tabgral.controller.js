const querySrv = require("../services/QueryService");
const qTabgral = require('./query/Tabgral.js');

exports.selectTabgralByNroTab = function (req, res) {
    querySrv.getQueryResults(qTabgral.selectTabgralByNroTab, [req.params.nro_tab])
    .then(response => res.send(response.value))
    .catch(err => res.status(400).send({"Ha ocurrido un error": err}));
}
