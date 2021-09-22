const poolSrv = require("./PoolService");

const executeQuery = (query, paramsArray, callback) => {
    let response = {
        status: 0,
        value: null,
        desc: ''
    }
    try {
        const pool = poolSrv.getInstance().getPool();
        pool.connect((poolErr, client, release) => {
            if (poolErr) { throw poolErr; } 
            client.query(query, paramsArray, (queryErr, resp) => {
                release();
                if (queryErr) {throw queryErr;}
                response = {
                    status: resp.rows.length >0 ? 200: 400,
                    value: resp.rows,
                    desc: resp.rows.length >0 ? `Exito` : `Sin resultados`
                }
                callback(response);
            });
        })
    } catch (err) {
        console.error(err);
    }
}

function getQueryResults(query, paramsArray) {
    return new Promise( (resolve, reject) =>{
        executeQuery(query, paramsArray, (queryResult)=> {
            if(queryResult.status===200) {
                resolve(queryResult);
            } else {
                reject(queryResult.desc);
            }
        });
        

    })
  }

module.exports.getQueryResults = getQueryResults;