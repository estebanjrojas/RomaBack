const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const override = require('method-override');
const configuracion = require("./utillities/config");

const app = express();
app.use(override());
app.use(cors());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
const router = express.Router();
app.use(router);

app.listen(configuracion.puerto, function () {
	console.log('Servidor Corriendo en puerto 3000');
});

router.get('/getClientIP', function (req, res) {
	res.status(200).send({ "ip": req.ip });
});


var Tabgral_routes = require('./routes/TabgralRoutes');
var Usuarios_routes = require('./routes/UsuariosRoutes');
var Personas_routes = require('./routes/PersonasRoutes');
var Empleados_routes = require('./routes/EmpleadosRoutes');
var Productos_routes = require('./routes/ProductosRoutes');
var Clientes_routes = require('./routes/ClientesRoutes');
var FacturaElectronica_routes = require('./routes/FacturaElectronicaRoutes');
var Provincias_routes = require('./routes/ProvinciasRouter');
var Ciudades_routes = require('./routes/CiudadesRoutes');

app.use('', Tabgral_routes);
app.use('', Usuarios_routes);
app.use('', Personas_routes);
app.use('', Empleados_routes);
app.use('', Productos_routes);
app.use('', Clientes_routes);
app.use('', FacturaElectronica_routes);
app.use('', Provincias_routes);
app.use('', Ciudades_routes);
