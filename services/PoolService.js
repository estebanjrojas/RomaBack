const configuracion = require("../utillities/config");
const connectionString = configuracion.bd;
var { Pool } = require('pg');


class PrivatePoolService {
    constructor() {
        this.pool = new Pool({
            connectionString: connectionString,
        });
    }

    getPool() {
        return this.pool;
    }
}

class PoolService {
    constructor() {
        throw new Error('Usar PoolService.getInstance()');
    }

    static getInstance(){
        if(!PoolService.instance) {
            PoolService.instance = new PrivatePoolService();
        }
        return PoolService.instance;
    }
}

module.exports = PoolService;