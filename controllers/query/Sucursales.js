exports.sucursalesAbiertas = `SELECT * FROM roma.sucursales WHERE coalesce(fecha_cierre, now()::date) >= now()::date;`;
