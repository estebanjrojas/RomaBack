module.exports = {
    puerto: 3010,
    bd: 'postgresql://postgres:roma11@192.168.100.44:5432/roma',
   // bd: 'postgresql://postgres:root@localhost:5433/roma',
    path: '/public/upload',
    llave: process.env["ROMA_REST"],
    cuit_factura_electronica: 23351957379,
    ambiente_produccion_factura_electronica : false
    
}