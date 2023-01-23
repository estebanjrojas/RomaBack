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
                console.log({'resp': resp.rows});
                release();
                if (queryErr) {throw queryErr;}
                response = {
                    status: resp.rowCount >0 ? 200: 400,
                    value: resp.rows,
                    desc: resp.rowCount >0 ? `Exito` : `Sin resultados`
                }
                callback(response);
            });
        })
    } catch (err) {
        console.error(err);
    }
}

function getQueryResults(query, paramsArray) {
    console.log({'query': query, "params": paramsArray});
    return new Promise( (resolve, reject) =>{
        executeQuery(query, paramsArray, (queryResult)=> {
            console.log({'queryResult': queryResult});
            if(queryResult.status===200) {
                resolve(queryResult);
            } else {
                reject(queryResult.desc);
            }
        });
        

    })
  }

module.exports.getQueryResults = getQueryResults;