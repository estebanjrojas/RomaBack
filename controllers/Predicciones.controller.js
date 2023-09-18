const tf = require('@tensorflow/tfjs');
const fs = require('fs');
const { readFileSync } = require('fs');
const { parse } = require('csv-parse/sync')
const csv = require('csv-parse');

exports.getCSVParseado = (req, res) => {
    console.log({ 'file': req.file });

    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo CSV.' });
    }
    // Obtener el contenido del archivo CSV desde req.file.buffer
    const csvData = req.file.buffer.toString('utf-8');

    //Analizar el archivo CSV
    csv.parse(csvData, {
        columns: true,
        cast: (value, context) => {
            if (context.column === ' cantidad') return Number(value);
            if (context.column === 'fecha') return new Date(value);
            return value
        }
    }, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error al analizar el archivo CSV.' });
        }
        res.json({ data });
    });
};

