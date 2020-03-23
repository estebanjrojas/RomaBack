const configuracion = require("../utillities/config");
const qFacturas = require("../controllers/query/Facturas");
let jwt = require('jsonwebtoken');
var { Pool } = require('pg');
const connectionString = configuracion.bd;
const AfipAPI = require('@afipsdk/afip.js');
const afip = new AfipAPI({ CUIT: configuracion.cuit_factura_electronica
                        , production: configuracion.ambiente_produccion_factura_electronica
                        , res_folder: './utillities/certificadosFE'
                        , cert: 'certificadoEsteban.pem'
                        , key: 'EstebanKEY.key' });



exports.ultimoNumeroFacturaAprobada = async function(req, res) {
    let lastVoucher = null;
    try {
         lastVoucher = await afip.ElectronicBilling.getLastVoucher(req.params.punto_venta, req.params.tipo_comprobante);
    } catch(e) {
        console.log(e);
         lastVoucher = e;
    }
 
    res.send({respuesta: lastVoucher});
}

generarFacturaReturnId = async function(ventas_id, tipo_comprobante){
    
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });
        let facturas_id = -1;
        try {
  
            await pool.query(qFacturas.generarFacturaReturnId, [ventas_id, tipo_comprobante])
                    .then(resp => {
                        facturas_id = resp.rows[0].facturas_id;
                     //   console.log(facturas_id);
                    }).catch(err => {
                        console.error("ERROR", err.stack);
                    });
            return facturas_id;

        } catch (error) {
            console.error("ERROR", error.stack);
            return -1;
        }
    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
};

facturaRechazada = async function(facturas_id, mensaje){
    
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            await pool.query(qFacturas.facturaRechazada, [facturas_id, mensaje])
                    .then(resp => {
                        facturas_id = resp.rows[0].facturas_id;
                    }).catch(err => {
                        console.error("ERROR", err.stack);
                    });
            return facturas_id;

        } catch (error) {
            console.error("ERROR", error.stack);
            return -1;
        }
    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'");
    }
};

guardarFacturaAprobada = async function(facturas_id, datos) {
    let respuesta_afip_id = -1;
    const cuit = datos['FeCabResp'].Cuit;
    const ptovta = datos['FeCabResp'].PtoVta;
    const cbtetipo = datos['FeCabResp'].CbteTipo;
    const fchproceso = datos['FeCabResp'].FchProceso;
    const cantreg = datos['FeCabResp'].CantReg;
    const resultado = datos['FeCabResp'].Resultado;
    const reproceso = datos['FeCabResp'].Reproceso;

    const concepto = datos['FeDetResp'].FECAEDetResponse.Concepto;
    const doctipo = datos['FeDetResp'].FECAEDetResponse.DocTipo;
    const docnro = datos['FeDetResp'].FECAEDetResponse.DocNro;
    const cbtedesde = datos['FeDetResp'].FECAEDetResponse.CbteDesde;
    const cbtehasta = datos['FeDetResp'].FECAEDetResponse.CbteHasta;
    const cbtefch = datos['FeDetResp'].FECAEDetResponse.CbteFch;
    const dresultado = datos['FeDetResp'].FECAEDetResponse.Resultado;
    const cae = datos['FeDetResp'].FECAEDetResponse.CAE;
    const caeFchVto = datos['FeDetResp'].FECAEDetResponse.CAEFchVto;
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            await pool.query(qFacturas.insertRespuestaAprobada, [facturas_id, 
            cuit, ptovta, cbtetipo, fchproceso, cantreg, resultado, reproceso,
            concepto, doctipo, docnro, cbtedesde, cbtehasta, cbtefch, dresultado, 
            cae, caeFchVto])
                    .then(resp => {
                        respuesta_afip_id = resp.rows[0].respuesta_afip_id;
                    }).catch(err => {
                        console.error("ERROR", err.stack);
                    });
            return respuesta_afip_id;

        } catch (error) {
            console.error("ERROR", error.stack);
            return -1;
        }
    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'}");
    }

}


setCaeVtoFacturaAprobada = async function(facturas_id){
    let respuesta = -1;
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });
        try {
            await pool.query(qFacturas.setCaeFchVto, [facturas_id])
                    .then(resp => {
                        respuesta = resp.rows[0].respuesta;
                    }).catch(err => {
                        console.error("ERROR", err.stack);
                    });
            return respuesta;

        } catch (error) {
            console.error("ERROR", error.stack);
            return -1;
        }
    } catch (err) {
        res.status(400).send("{'mensaje': 'Ocurrio un Error'}");
    }
};

getDatosComprobante = async function(facturas_id) {
    //console.log(`getDatosComprobante(${facturas_id})!!!`);
    try {
        var pool = new Pool({
            connectionString: connectionString,
        });
         try {
              let comp = await pool.query(qFacturas.getDatosFactura, [facturas_id]);
              
             return comp.rows[0];

        } catch (error) {
            console.error("ERROR", error.stack);
            return null;
        }
    } catch (err) {
        console.error("ERROR", error.stack);
        return null;
    }
};

exports.generarFacturaElectronica = async function(req, res) {
    
    
    const gen = await generarFacturaReturnId(req.params.ventas_id, req.params.tipo_comprobante);
    const fac = await getDatosComprobante(gen);
    const data = {
        'CantReg' 	: parseInt(fac.fecae_cantidad_items),  // Cantidad de comprobantes a registrar
        'PtoVta' 	: parseInt(fac.fecae_punto_venta),  // Punto de venta
        'CbteTipo' 	: parseInt(fac.fecae_tipo_comprobante),  // Tipo de comprobante (ver tipos disponibles) 
        'Concepto' 	: parseInt(fac.fecae_concepto),  // Concepto del Comprobante: (1)Productos, (2)Servicios, (3)Productos y Servicios
        'DocTipo' 	: parseInt(fac.fecae_tipo_documento), // Tipo de documento del comprador (99 consumidor final, ver tipos disponibles)
        'DocNro' 	: parseInt(fac.fecae_numero_documento),  // Número de documento del comprador (0 consumidor final)
        'CbteDesde' : parseInt(fac.fecae_comprobante_desde),  // Número de comprobante o numero del primer comprobante en caso de ser mas de uno
        'CbteHasta' : parseInt(fac.fecae_comprobante_hasta),  // Número de comprobante o numero del último comprobante en caso de ser mas de uno
        'CbteFch' 	: parseInt(fac.fecae_comprobante_fecha), // (Opcional) Fecha del comprobante (yyyymmdd) o fecha actual si es nulo
        'ImpTotal' 	: parseFloat(fac.fecae_importe_total), // Importe total del comprobante
        'ImpTotConc': parseFloat(fac.fecae_importe_neto_no_gravado),   // Importe neto no gravado
        'ImpNeto' 	: parseFloat(fac.fecae_importe_neto_gravado), // Importe neto gravado
        'ImpOpEx' 	: parseFloat(fac.fecae_importe_exento),   // Importe exento de IVA
        'ImpIVA' 	: parseFloat(fac.fecae_importe_total_iva),  //Importe total de IVA
        'ImpTrib' 	: parseFloat(fac.fecae_importe_total_tributos),   //Importe total de tributos
        'MonId' 	: fac.fecae_tipo_moneda, // Tipo de moneda usada en el comprobante (ver tipos disponibles)('PES' para pesos argentinos) 
        'MonCotiz' 	: parseInt(fac.fecae_cotizacion_moneda),     // Cotización de la moneda usada (1 para pesos argentinos)  
        'Iva' 		: [ // (Opcional) Alícuotas asociadas al comprobante
            {
                'Id' 		: 5, // Id del tipo de IVA (5 para 21%)(ver tipos disponibles) 
                'BaseImp' 	: parseFloat(fac.fecae_importe_neto_gravado), // Base imponible
                'Importe' 	: parseFloat(fac.fecae_importe_total_iva) // Importe 
            }
        ],
    };

    
   // console.log(data);
    try{
        const resAfip = await afip.ElectronicBilling.createVoucher(data, true);
         await guardarFacturaAprobada(gen, resAfip);
         await setCaeVtoFacturaAprobada(gen);
        res.send("Factura Aprobada");
    }
    catch(err) {
        const rech = await facturaRechazada(gen, err.message);
        if(rech != undefined) {
            console.log("Rechazo Cargado");
        } 
        res.send({"Error " : err.message, "Tipo" : err.name});
    };

}

exports.getDatosFacturaAfip = async function(req, res) {
    try {
        const info = await afip.ElectronicBilling.getVoucherInfo(req.params.numero, req.params.punto_venta, req.params.tipo_comprobante)
        res.send(info);
    }
    catch(err) {
        res.send({"Error " : err.message, "Tipo" : err.name});
    }
    
}


exports.getEstadoServidor = async function(req, res) {
    const serverStatus = await afip.ElectronicBilling.getServerStatus();
    res.send({"Estado" : serverStatus});
}

exports.getTributosDisponibles = async function(req, res) {
    const taxTypes = await afip.ElectronicBilling.getTaxTypes();
    //Para mas información acerca de este método ver el item 4.10 de la especificación del Web service
    res.send(taxTypes);
}

exports.getOpcionesComprobanteDisponibles = async function(req, res) {
    const optionTypes = await afip.ElectronicBilling.getOptionsTypes();
    //Para mas información acerca de este método ver el item 4.9 de la especificacion del Web service
    res.send(optionTypes);
}

exports.getTiposMonedaDisponibles = async function(req, res) {
    const currenciesTypes = await afip.ElectronicBilling.getCurrenciesTypes();
    //Para mas información acerca de este método ver el item 4.8 de la especificación del Web service
    res.send(currenciesTypes);
}

exports.getTiposAlicuotasDisponibles = async function(req, res) {
    const aloquotTypes = await afip.ElectronicBilling.getAliquotTypes();
    //Para mas información acerca de este método ver el item 4.7 de la especificación del Web service
    res.send(aloquotTypes);
}

exports.getTiposDocumentosDisponibles = async function(req, res) {
    const documentTypes = await afip.ElectronicBilling.getDocumentTypes();
    //Para mas información acerca de este método ver el item 4.6 de la especificación del Web service
    res.send(documentTypes);
}

exports.getTiposConceptoDisponibles = async function(req, res) {
    const conceptTypes = await afip.ElectronicBilling.getConceptTypes();
    //Para mas información acerca de este método ver el item 4.5 de la especificación del Web service
    res.send(conceptTypes);
}

exports.getTiposComprobanteDisponibles = async function(req, res) {
    const voucherTypes = await afip.ElectronicBilling.getVoucherTypes();
    //Para mas información acerca de este método ver el item 4.4 de la especificación del Web service
    res.send(voucherTypes);
}