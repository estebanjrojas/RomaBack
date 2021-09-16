exports.getCiudadesPorProvincia = `
    SELECT * FROM ciudades WHERE provincias_id = $1 ORDER BY id;
`;

exports.getCiudadesIdPorNombre = `
SELECT id FROM ciudades WHERE nombre ILIKE  '%$1%' LIMIT 1;`;