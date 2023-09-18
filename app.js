const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express"),
  swaggerDocument = require("./swagger.json");
const override = require("method-override");
const configuracion = require("./utillities/config");
const multer = require('multer');
const upload = multer(); // Middleware para manejar archivos

const app = express();
app.use(override());
app.use(cors());
app.options("*", cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "50mb" }));
const router = express.Router();
app.use(router);
app.use(upload.single('csvFile')); // 'csvFile' es el nombre del campo que el frontend envía


module.exports = app.listen(configuracion.puerto, function () {
  console.log("Servidor Corriendo en puerto " + configuracion.puerto);
});

router.use("/", swaggerUi.serve);
router.get("/", swaggerUi.setup(swaggerDocument));

const Usuarios_routes = require("./routes/UsuariosRoutes");
const Personas_routes = require("./routes/PersonasRoutes");
const Empleados_routes = require("./routes/EmpleadosRoutes");
const Productos_routes = require("./routes/ProductosRoutes");
const Clientes_routes = require("./routes/ClientesRoutes");
const FacturaElectronica_routes = require("./routes/FacturaElectronicaRoutes");
const Provincias_routes = require("./routes/ProvinciasRouter");
const Ciudades_routes = require("./routes/CiudadesRoutes");
const Domicilios_routes = require("./routes/DomiciliosRoutes");
const Categorias_routes = require("./routes/CategoriasRoutes");
const PuntosVenta_routes = require("./routes/PuntosVentaRoutes");
const Ventas_routes = require("./routes/VentasRoutes");
const FacturasImpresion_routes = require("./routes/FacturasImpresionRoutes");
const Menu_routes = require("./routes/MenuRoutes");
const Facturas_routes = require("./routes/FacturasRoutes");
const Sucursales_routes = require("./routes/SucursalesRoutes");
const Predicciones_routes = require("./routes/PrediccionesRoutes");
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("", Usuarios_routes);
app.use("", Personas_routes);
app.use("", Empleados_routes);
app.use("", Productos_routes);
app.use("", Clientes_routes);
app.use("", FacturaElectronica_routes);
app.use("", Provincias_routes);
app.use("", Ciudades_routes);
app.use("", Domicilios_routes);
app.use("", Categorias_routes);
app.use("", PuntosVenta_routes);
app.use("", Ventas_routes);
app.use("", FacturasImpresion_routes);
app.use("", Menu_routes);
app.use("", Facturas_routes);
app.use("", Sucursales_routes);
app.use("", Predicciones_routes);
