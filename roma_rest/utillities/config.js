module.exports = {
    puerto: 3010,
    //bd: 'postgresql://postgres:roma11@192.168.1.44:5432/roma',
    bd: 'postgresql://postgres:postgres@localhost:5432/roma',
    path: '/public/upload',
    llave: process.env["ROMA_REST"]
}