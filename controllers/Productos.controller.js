//Conexión a Postgres
const configuracion = require("../utillities/config");
var { Pool } = require("pg");
const connectionString = configuracion.bd;
const querySrv = require("../services/QueryService");
const qProductos = require("./query/Productos.js");
const { data } = require("@tensorflow/tfjs");
//------------------------------GET------------------------------//

exports.getProductosTodos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getProductosTodos, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getProductosBusqueda = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getProductosBusqueda, [
      req.params.texto_busqueda,
    ])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getDatosProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getDatosProductos, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getCaracteristicasProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getCaracteristicasProductos, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getCategoriasProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getCategoriasProductos, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getUltimoPrecioValido = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getUltimoPrecioValido, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getHistorialPrecios = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getHistorialPrecios, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getImagenesProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getImagenesProductos, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getProductosPorCategoriaCampoBusqueda = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getProductosPorCategoriaCampoBusqueda, [
      req.params.categorias_id,
      req.params.campo_buscar,
      req.params.texto_buscar,
    ])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getFotosCargadas = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getFotosCargadas, [req.params.id])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

//-----------> PAGINACION INICIO :
exports.getCantidadPaginasProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getCantidadPaginasProductos, [])
    .then((response) => res.send({ regCantidadPaginas: response.value[0] }))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getCantidadPaginasProductosTxt = function (req, res) {
  let parametrosBusqueda = ``;
  const habilitarBusquedaCodigo = parseInt(req.params.busca_codigo);
  const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
  const habilitarBusquedaDescripcion = parseInt(req.params.busca_descripcion);
  const habilitarBusquedaCategoria = parseInt(req.params.busca_categoria);

  if (
    habilitarBusquedaCodigo +
    habilitarBusquedaNombre +
    habilitarBusquedaDescripcion +
    habilitarBusquedaCategoria >
    0
  ) {
    parametrosBusqueda = parametrosBusqueda + ` WHERE `;
    if (habilitarBusquedaCodigo == 1) {
      parametrosBusqueda =
        parametrosBusqueda +
        `p.codigo::varchar ilike '%` +
        req.params.txt +
        `%'`;
    }
    if (habilitarBusquedaNombre == 1) {
      if (habilitarBusquedaCodigo == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.nombre::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.nombre::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }

    if (habilitarBusquedaDescripcion == 1) {
      if (habilitarBusquedaCodigo + habilitarBusquedaNombre == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.descripcion::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.descripcion::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }
    if (habilitarBusquedaCategoria == 1) {
      if (
        habilitarBusquedaCodigo +
        habilitarBusquedaNombre +
        habilitarBusquedaDescripcion ==
        0
      ) {
        parametrosBusqueda =
          parametrosBusqueda +
          `cat.nombre::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR cat.nombre::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }
  }

  const query = ` 
    SELECT 
        COUNT(*) as cantidad_registros,
        (COUNT(*)/5 )+ (CASE WHEN COUNT(*) % 5 >0 THEN 1 ELSE 0 END) AS cantidad_paginas
    FROM (
        SELECT 
                p.id as productos_id
            ,  p.*
            , pc.*
            , cat.nombre as nombre_categoria
            , roma.get_imagen_principal_producto(p.id) as imagen
        FROM roma.productos p
        JOIN roma.productos_categorias pc ON p.id = pc.productos_id
        JOIN roma.categorias cat ON pc.categorias_id = cat.id
        ${parametrosBusqueda}
    )x `;

  querySrv
    .getQueryResults(query, [])
    .then((response) => res.send({ regCantidadPaginas: response.value[0] }))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getProductos, [
      req.params.paginaActual,
      req.params.cantidadPaginas,
    ])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getProductosTxt = function (req, res) {
  let parametrosBusqueda = ``;
  const habilitarBusquedaCodigo = parseInt(req.params.busca_codigo);
  const habilitarBusquedaNombre = parseInt(req.params.busca_nombre);
  const habilitarBusquedaDescripcion = parseInt(req.params.busca_descripcion);
  const habilitarBusquedaCategoria = parseInt(req.params.busca_categoria);

  if (
    habilitarBusquedaCodigo +
    habilitarBusquedaNombre +
    habilitarBusquedaDescripcion +
    habilitarBusquedaCategoria >
    0
  ) {
    parametrosBusqueda = parametrosBusqueda + ` WHERE `;
    if (habilitarBusquedaCodigo == 1) {
      parametrosBusqueda =
        parametrosBusqueda +
        `p.codigo::varchar ilike '%` +
        req.params.txt +
        `%'`;
    }
    if (habilitarBusquedaNombre == 1) {
      if (habilitarBusquedaCodigo == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.nombre::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.nombre::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }

    if (habilitarBusquedaDescripcion == 1) {
      if (habilitarBusquedaCodigo + habilitarBusquedaNombre == 0) {
        parametrosBusqueda =
          parametrosBusqueda +
          `p.descripcion::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR p.descripcion::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }
    if (habilitarBusquedaCategoria == 1) {
      if (
        habilitarBusquedaCodigo +
        habilitarBusquedaNombre +
        habilitarBusquedaDescripcion ==
        0
      ) {
        parametrosBusqueda =
          parametrosBusqueda +
          `cat.nombre::varchar ilike '%` +
          req.params.txt +
          `%'`;
      } else {
        parametrosBusqueda =
          parametrosBusqueda +
          `OR cat.nombre::varchar ilike '%` +
          req.params.txt +
          `%'`;
      }
    }
  }

  const query = ` 
    SELECT p.id as productos_id
            ,  p.*
            , pc.*
            , cat.nombre as nombre_categoria
            , roma.get_imagen_principal_producto(p.id) as imagen
    FROM roma.productos p
    JOIN roma.productos_categorias pc ON p.id = pc.productos_id
    JOIN roma.categorias cat ON pc.categorias_id = cat.id
    ${parametrosBusqueda}
    OFFSET (5* ((CASE 
        WHEN ${req.params.paginaActual} > ${req.params.cantidadPaginas} THEN ${req.params.cantidadPaginas}
        WHEN ${req.params.paginaActual} <1 THEN 1 
        ELSE ${req.params.paginaActual} END)-1))
    LIMIT 5 `;

  querySrv
    .getQueryResults(query, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};
//<------------------PAGINACION FIN

exports.getNovedadesProductosLimit = async function (req, res) {
  querySrv
    .getQueryResults(qProductos.getNovedadesProductosLimit, [
      req.params.fecha_desde,
      req.params.fecha_hasta,
      req.params.limit,
    ])
    .then((response) => res.send(response.value))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.verificarProductoPoseeCaracteristicas = async function (req, res) {
  querySrv
    .getQueryResults(qProductos.verificarProductoPoseeCaracteristicas, [
      req.params.productos_id,
    ])
    .then((response) => res.send(response.value))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.verificarProductoPoseeImagenes = async function (req, res) {
  querySrv
    .getQueryResults(qProductos.verificarProductoPoseeImagenes, [
      req.params.productos_id,
    ])
    .then((response) => res.send(response.value))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.getTiposProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.getTiposProductos, [])
    .then((response) => res.send(JSON.stringify(response.value)))
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};
//------------------------------POST------------------------------//

exports.insertProductoReturnId = function (req, res) {
  var pool = new Pool({
    connectionString: connectionString,
  });

  (async () => {
    const client = await pool.connect();
    try {

      await client.query("BEGIN");

      console.log({ 'body': req.body });

      const { rows } = await client.query(
        qProductos.insertProductosReturningId,
        [req.body.codigo, req.body.nombre_producto, req.body.descripcion_producto, req.body.descripcion_factura, req.body.tipo]
      );

      const { precios_productos } = await client.query(
        qProductos.insertPreciosProductos,
        [req.body.precio, 1, rows[0].id]
      );

      await client.query("COMMIT");
      res.status(200).send({
        mensaje: "El Producto fue guardado exitosamente",
        id: rows[0].id,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      res
        .status(400)
        .send({ mensaje: "Ocurrio un error al cargar el producto" });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};

exports.insertNuevoPrecioProducto = function (req, res) {
  querySrv
    .getQueryResults(qProductos.insertNuevoPrecioProducto, [
      req.body.precio,
      req.body.productos_id,
    ])
    .then((response) =>
      res.send({ mensaje: "El Precio se cargo exitosamente" })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.insertCaracteristicasProducto = function (req, res) {
  querySrv
    .getQueryResults(qProductos.insertCaracteristicasProducto, [
      req.body.nombre,
      req.body.descripcion,
      req.body.valor,
      req.body.productos_id,
    ])
    .then((response) =>
      res.send({ mensaje: "Las Caracteristicas se cargaron exitosamente" })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.eliminarCategoriasProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.eliminarCategoriasProductos, [
      req.params.productos_id,
    ])
    .then((response) =>
      res.send({ mensaje: "La Categoria se elimino exitosamente" })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.insertCategoriasProducto = function (req, res) {
  querySrv
    .getQueryResults(qProductos.insertCategoriasProducto, [
      req.body.productos_id,
      req.body.categorias_id,
    ])
    .then((response) =>
      res.send({ mensaje: "La Categoria y producto se relaciono exitosamente" })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};

exports.cargarImagenProducto = function (req, res) {
  var pool = new Pool({
    connectionString: connectionString,
  });

  (async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      /*await client.query(`
            DELETE FROM flores_avisos.salas_fallecidos_fotos 
            WHERE salas_fallecidos_id = `+ req.body.salas_fallecidos_id + ``)
            */
      await client.query(
        `
            INSERT INTO roma.productos_imagenes(productos_id
                , imagen, fecha_carga, principal)
            VALUES(` +
        req.body.productos_id +
        `
                , '` +
        req.body.imagen +
        `', now(), ` +
        req.body.predeterminada +
        `); `
      );

      await client.query("COMMIT");
      res.status(200).send({ mensaje: "La imagen se cargo exitosamente" });
    } catch (e) {
      await client.query("ROLLBACK");
      res.status(400).send({ mensaje: "Ocurrio un error al cargar la imagen" });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};



exports.insertProducto = function (req, res) {
  var pool = new Pool({
    connectionString: connectionString,
  });

  var body = req.body;
  console.log({ 'datos:': req.body, "body": body });

  (async () => {
    const client = await pool.connect();
    try {

      await client.query("BEGIN");

      const { rows } = await client.query(
        qProductos.insertProductosReturningId,
        [
          body.producto.codigo,
          body.producto.nombre_producto,
          body.producto.descripcion_producto,
          body.producto.descripcion_factura,
          body.producto.tipo]);

      const { precios_productos } = await client.query(
        qProductos.insertPreciosProductos,
        [body.producto.precio, 1, rows[0].id]
      );

      var producto_caracteristicas;
      for (let i = 0; i < body.caracteristicas.length; i++) {
        producto_caracteristicas = await client.query(
          qProductos.insertCaracteristicasProducto, [
          body.caracteristicas[i].nombre,
          body.caracteristicas[i].descripcion,
          body.caracteristicas[i].valor,
          Number(rows[0].id),
        ]);
      }

      var producto_categorias;
      for (let j = 0; j < body.categorias.length; j++) {
        producto_categorias = await client.query(
          qProductos.insertCategoriasProducto, [
          rows[0].id,
          body.categorias[j].id,
        ]);
      }

      var producto_imagenes;
      for (let k = 0; k < body.imagenes.length; k++) {
        producto_imagenes = await client.query(
          `
            INSERT INTO roma.productos_imagenes(productos_id
                , imagen, fecha_carga, principal)
            VALUES(
              ` + rows[0].id + `, 
              '` + body.imagenes[k].imagen + `', 
              now(), 
              ` + body.imagenes[k].predeterminada + `); `
        );
      }

      await client.query("COMMIT");
      res.status(200).send({
        mensaje: "El Producto fue guardado exitosamente",
        id: rows[0].id,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      res
        .status(400)
        .send({ mensaje: "Ocurrio un error al cargar el producto" });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};


//------------------------------PUT------------------------------//


exports.actualizarFechaHastaPrecio = function (req, res) {
  querySrv
    .getQueryResults(qProductos.actualizarFechaHastaPrecio, [
      req.body.productos_id,
    ])
    .then((response) =>
      res.send({ mensaje: "La fecha de cese fue actualizada exitosamente" })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido Error ${err}` }))
    );
};



exports.updateProducto = function (req, res) {
  var pool = new Pool({
    connectionString: connectionString,
  });

  var body = req.body;

  (async () => {
    const client = await pool.connect();
    try {

      await client.query("BEGIN");

      const { rows } = await client.query(qProductos.actualizarDatosProductos,
        [
          body.producto.codigo,
          body.producto.nombre_producto,
          body.producto.descripcion_producto,
          body.producto.descripcion_factura,
          body.producto.tipo,
          body.producto_id
        ]);

      const { precios_productos } = await client.query(qProductos.actualizarPreciosProductos,
        [
          body.producto.precio,
          body.producto.unidad,
          body.producto_id
        ]);

      const { eliminar_caracteristicas } = await client.query(qProductos.eliminarCaracteristicasProductos, [
        body.producto_id
      ]);

      var producto_caracteristicas;
      for (let i = 0; i < body.caracteristicas.length; i++) {
        producto_caracteristicas = await client.query(
          qProductos.insertCaracteristicasProducto, [
          body.caracteristicas[i].nombre,
          body.caracteristicas[i].descripcion,
          body.caracteristicas[i].valor,
          body.producto_id,
        ]);
      }

      const { eliminar_categorias } = await client.query(qProductos.eliminarCategoriasProductos, [
        body.producto_id
      ]);

      var producto_categorias;
      for (let j = 0; j < body.categorias.length; j++) {
        producto_categorias = await client.query(
          qProductos.insertCategoriasProducto, [
          body.producto_id,
          body.categorias[j].id,
        ]);
      }

      const { eliminar_imagenes } = await client.query(qProductos.eliminarImagenesProductos, [
        body.producto_id
      ]);

      var producto_imagenes;
      for (let k = 0; k < body.imagenes.length; k++) {
        producto_imagenes = await client.query(qProductos.insertImagenesProducto,
          [
            body.producto_id,
            body.imagenes[k].imagen,
            body.imagenes[k].predeterminada
          ]);
      }

      await client.query("COMMIT");
      res.status(200).send({
        mensaje: "El Producto fue actualizado exitosamente",
        id: body.producto_id,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      res
        .status(400)
        .send({ mensaje: "Ocurrio un error al actualizar el producto" });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};



//------------------------------DELETE------------------------------//

exports.eliminarCaracteristicasProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.eliminarCaracteristicasProductos, [
      req.params.productos_id,
    ])
    .then((response) =>
      res.send({
        mensaje: "Las caracteristicas del producto se eliminaron exitosamente",
      })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido un Error ${err}` }))
    );
};

exports.eliminarImagenesProductos = function (req, res) {
  querySrv
    .getQueryResults(qProductos.eliminarImagenesProductos, [
      req.params.productos_id,
    ])
    .then((response) =>
      res.send({
        mensaje: "Las imagenes del producto se eliminaron exitosamente",
      })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido un Error ${err}` }))
    );
};

exports.eliminarProductoById = function (req, res) {
  querySrv
    .getQueryResults(qProductos.eliminarProductoById, [req.params.productos_id])
    .then((response) =>
      res.send({ mensaje: "Las producto se elimino exitosamente" })
    )
    .catch((err) =>
      res
        .status(400)
        .send(JSON.stringify({ mensaje: `Ha ocurrido un Error ${err}` }))
    );
};



exports.deleteProducto = function (req, res) {
  var pool = new Pool({
    connectionString: connectionString,
  });

  var body = req.body;

  (async () => {
    const client = await pool.connect();
    try {

      await client.query("BEGIN");

      const { eliminar_producto } = await client.query(qProductos.eliminarProductoById,
        [
          req.params.producto_id
        ]);

      await client.query("COMMIT");
      res.status(200).send({
        mensaje: "El Producto fue eliminado exitosamente",
        id: req.params.producto_id,
      });
    } catch (e) {
      await client.query("ROLLBACK");
      res
        .status(400)
        .send({ mensaje: "Ocurrio un error al eliminar el producto" });
      throw e;
    } finally {
      client.release();
    }
  })().catch((e) => console.error(e.stack));
};