const Fs = require('fs')  
const Path = require('path')  
const Util = require('util')  
const Puppeteer = require('puppeteer')  
const Handlebars = require('handlebars')  
const ReadFile = Util.promisify(Fs.readFile)

class Invoice {  
  async html() {
    try {
      const data = {
        nombre_cliente: 'Raul Martinez',
        tipo_factura: 'Factura B',
        fecha_emision: '11/03/2020',
        fecha_vencimiento: '21/03/2020',
        punto_venta: '0001',
        numero: '000001',
        monto_total: '121.00',
        monto_iva: '21.00',
        monto_neto: '100.00',
        cuit_empresa: '333111212',
        razon_social: 'Proyecto Final',
        email_empresa: 'raul.martinez230@gmail.com',
        detalle_factura: [{producto: 'P1', subtotal_bruto: '60.5', subtotal_iva: '10.5', subtotal_neto: '50'},
        {producto: 'P2', subtotal_bruto: '60.5', subtotal_iva: '10.5', subtotal_neto: '50'}]
        
      }

      const templatePath = Path.resolve('', 'utillities', 'invoice.html');
      const content = await ReadFile(templatePath, 'utf8');
      // compile and render the template with handlebars
      const template = Handlebars.compile(content);
      return template(data)
    } catch (error) {
        
      throw new Error('Cannot create invoice HTML template: '+error)
    }
  }

  async pdf() {
    const html = await this.html();
    const browser = await Puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);

    return page.pdf({path: './utillities/pdf_generados/facturas/invoice.pdf'});
  }


}

exports.sendPDF = async function(req, res) {
  let lastVoucher = undefined;
    const invoice = new Invoice();
    try {
         lastVoucher = await invoice.pdf();
    } catch(e) {
        console.log(e);
         lastVoucher = e;
    }
 
    res.download("./utillities/pdf_generados/facturas/invoice.pdf");
}