const qMenu = require("./query/Menu.js");
const querySrv = require("../services/QueryService");

exports.getMenuUsuario = async function (req, res) {
    querySrv.getQueryResults(qMenu.getMenu, [req.params.nomb_usr])
    .then(response => res.send({ "menu": response.value[0].menu }))
    .catch(err => res.status(400).send(JSON.stringify({"mensaje": `Ha ocurrido Error ${err}` })));
}
