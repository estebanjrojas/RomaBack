const Fs = require('fs');  
const Path = require('path');  
const Util = require('util');
const Puppeteer = require('puppeteer');
const Handlebars = require('handlebars');
const ReadFile = Util.promisify(Fs.readFile);
const qFacturas = require("../controllers/query/Facturas");
var { Pool } = require('pg');
const configuracion = require("../utillities/config");
const connectionString = configuracion.bd;


class Invoice {  
  async html(data) {

    try {
      const templatePath = Path.resolve('', 'utillities', 'invoice.html');
      const content = await ReadFile(templatePath, 'utf8');
      // compile and render the template with handlebars
      const template = Handlebars.compile(content);
      return template(data)
    } catch (error) {
        
      throw new Error('Cannot create invoice HTML template: '+error)
    }
  }

  async pdf(data) {
    const html = await this.html(data);
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    return page.pdf({path: './utillities/pdf_generados/facturas/invoice.pdf'});
  }


    
}


getDatosComprobante = async function(facturas_id) {
  try {
      var pool = new Pool({
          connectionString: connectionString,
      });
      try {
            let comp = await pool.query(qFacturas.getDatosFacturaImpresion, [facturas_id]);
            
          return comp.rows[0];

      } catch (error) {
          console.error("ERROR", error.stack);
          return null;
      }
  } catch (err) {
      console.error("ERROR", err.stack);
      return null;
  }
};

getDetallesComprobante = async function(facturas_id) {
  try {
      var pool = new Pool({
          connectionString: connectionString,
      });
      try {
            let comp = await pool.query(qFacturas.getDetalleFacturaImpresion, [facturas_id]);
            
          return comp.rows;

      } catch (error) {
          console.error("ERROR", error.stack);
          return null;
      }
  } catch (err) {
      console.error("ERROR", err.stack);
      return null;
  }
};



exports.generarFacturaPDF = async function(req, res) {
    const invoice = new Invoice();
    try {
        const facDetails = await getDetallesComprobante(req.params.facturas_id);
        let details = [];
        facDetails.forEach(det => {
          details.push({producto: det.descripcion_factura,
                        precio_uni: det.monto,
                        subtotal_bruto: det.subtotal, 
                        subtotal_iva: det.subtotal_iva, 
                        subtotal_neto: det.subtotal_neto,
                        descuento: det.descuento,
                        cantidad: det.cantidad,
                        codigo_producto: det.codigo})
        });

         const facData = await getDatosComprobante(req.params.facturas_id);
         let data = {
          nombre_cliente: facData.nombre_cliente+" "+facData.apellido_cliente,
          tipo_factura: facData.tipo_factura,
          fecha_emision: facData.fecha_emision,
          fecha_vencimiento: facData.fecha_vencimiento,
          punto_venta: facData.punto_venta_factura,
          numero: facData.numero_factura,
          monto_total: facData.monto_total,
          monto_iva: facData.monto_iva,
          monto_neto: facData.monto_neto,
          cuit_empresa: facData.cuit_empresa,
          razon_social: facData.razon_social,
          email_empresa: facData.email_empresa,
          cae: facData.cae,
          vencimiento_cae: facData.vencimiento_cae,
          detalle_factura: details
        }
        const lastVoucher = await invoice.pdf(data);
        res.download('./utillities/pdf_generados/facturas/invoice.pdf');
    } catch(e) {
        console.log(e);
         lastVoucher = e;
    }
 
    
}