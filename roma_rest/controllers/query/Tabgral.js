exports.selectTabgralByNroTab = `
SELECT * FROM public.tabgral WHERE nro_tab = $1 ORDER BY descrip;
`;