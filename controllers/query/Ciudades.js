exports.getCiudadesPorProvincia = `
    SELECT * FROM ciudades WHERE provincias_id = $1 ORDER BY id;
`;


exports.getCiudadesIdPorNombre = `
SELECT id FROM ciudades WHERE upper(trim(nombre)) = upper(trim($1)) LIMIT 1;`;


exports.selectAll = `SELECT * FROM public.ciudades;`;
